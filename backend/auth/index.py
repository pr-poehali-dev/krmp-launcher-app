"""
Авторизация пользователей: регистрация, вход, выход, получение профиля.
Поле action в теле запроса: register | login | logout | me
"""

import json
import os
import hashlib
import secrets
import psycopg2

SCHEMA = "t_p14749175_krmp_launcher_app"

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def make_session_id() -> str:
    return secrets.token_hex(32)


def json_resp(data: dict, status: int = 200) -> dict:
    return {
        "statusCode": status,
        "headers": {**CORS, "Content-Type": "application/json"},
        "body": json.dumps(data, ensure_ascii=False, default=str),
    }


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "POST")
    body = {}
    if event.get("body"):
        body = json.loads(event["body"])

    headers = event.get("headers") or {}
    session_id = (
        headers.get("x-session-id")
        or headers.get("X-Session-Id")
        or body.get("session_id")
        or ""
    )

    action = body.get("action", "me" if method == "GET" else "")

    conn = get_conn()
    cur = conn.cursor()

    # REGISTER
    if action == "register":
        username = (body.get("username") or "").strip()
        email = (body.get("email") or "").strip().lower()
        password = body.get("password") or ""

        if not username or not email or not password:
            cur.close(); conn.close()
            return json_resp({"error": "Заполните все поля"}, 400)
        if len(username) < 3:
            cur.close(); conn.close()
            return json_resp({"error": "Никнейм не менее 3 символов"}, 400)
        if len(password) < 6:
            cur.close(); conn.close()
            return json_resp({"error": "Пароль не менее 6 символов"}, 400)

        cur.execute(
            f"SELECT id FROM {SCHEMA}.users WHERE LOWER(username) = %s OR email = %s",
            (username.lower(), email)
        )
        if cur.fetchone():
            cur.close(); conn.close()
            return json_resp({"error": "Никнейм или email уже занят"}, 409)

        initials = username[:2].upper()
        cur.execute(
            f"""INSERT INTO {SCHEMA}.users (username, email, password_hash, avatar_initials)
                VALUES (%s, %s, %s, %s) RETURNING id""",
            (username, email, hash_password(password), initials)
        )
        user_id = cur.fetchone()[0]
        sid = make_session_id()
        cur.execute(
            f"INSERT INTO {SCHEMA}.sessions (id, user_id) VALUES (%s, %s)",
            (sid, user_id)
        )
        conn.commit()
        cur.close(); conn.close()
        return json_resp({"session_id": sid, "username": username, "avatar_initials": initials})

    # LOGIN
    if action == "login":
        login = (body.get("login") or "").strip().lower()
        password = body.get("password") or ""

        cur.execute(
            f"""SELECT id, username, avatar_initials, rank, vip, hours_played,
                       level, level_progress, sessions_count, money_earned, km_driven, reputation
                FROM {SCHEMA}.users
                WHERE (LOWER(username) = %s OR email = %s) AND password_hash = %s""",
            (login, login, hash_password(password))
        )
        row = cur.fetchone()
        if not row:
            cur.close(); conn.close()
            return json_resp({"error": "Неверный логин или пароль"}, 401)

        sid = make_session_id()
        cur.execute(
            f"INSERT INTO {SCHEMA}.sessions (id, user_id) VALUES (%s, %s)",
            (sid, row[0])
        )
        conn.commit()
        cur.close(); conn.close()
        return json_resp({
            "session_id": sid,
            "user": {
                "id": row[0], "username": row[1], "avatar_initials": row[2],
                "rank": row[3], "vip": row[4], "hours_played": row[5],
                "level": row[6], "level_progress": row[7], "sessions_count": row[8],
                "money_earned": row[9], "km_driven": row[10], "reputation": row[11],
            }
        })

    # ME
    if action == "me" or method == "GET":
        if not session_id:
            cur.close(); conn.close()
            return json_resp({"error": "Не авторизован"}, 401)

        cur.execute(
            f"""SELECT u.id, u.username, u.avatar_initials, u.rank, u.vip, u.hours_played,
                       u.level, u.level_progress, u.sessions_count, u.money_earned,
                       u.km_driven, u.reputation
                FROM {SCHEMA}.sessions s
                JOIN {SCHEMA}.users u ON u.id = s.user_id
                WHERE s.id = %s AND s.expires_at > NOW()""",
            (session_id,)
        )
        row = cur.fetchone()
        cur.close(); conn.close()
        if not row:
            return json_resp({"error": "Сессия истекла"}, 401)

        return json_resp({
            "user": {
                "id": row[0], "username": row[1], "avatar_initials": row[2],
                "rank": row[3], "vip": row[4], "hours_played": row[5],
                "level": row[6], "level_progress": row[7], "sessions_count": row[8],
                "money_earned": row[9], "km_driven": row[10], "reputation": row[11],
            }
        })

    # LOGOUT
    if action == "logout":
        if session_id:
            cur.execute(f"DELETE FROM {SCHEMA}.sessions WHERE id = %s", (session_id,))
            conn.commit()
        cur.close(); conn.close()
        return json_resp({"ok": True})

    cur.close(); conn.close()
    return json_resp({"error": "Неизвестное действие"}, 400)
