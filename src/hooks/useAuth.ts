import { useState, useEffect, useCallback } from "react";

const AUTH_URL = "https://functions.poehali.dev/3adeb55e-8c03-413d-9c10-803beb7102cb";
const SESSION_KEY = "krmp_session_id";

export interface User {
  id: number;
  username: string;
  avatar_initials: string;
  rank: string;
  vip: boolean;
  hours_played: number;
  level: number;
  level_progress: number;
  sessions_count: number;
  money_earned: number;
  km_driven: number;
  reputation: number;
}

async function authCall(body: Record<string, unknown>, sessionId?: string) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (sessionId) headers["X-Session-Id"] = sessionId;
  const res = await fetch(AUTH_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  return res.json();
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getSessionId = () => localStorage.getItem(SESSION_KEY) || "";

  const fetchMe = useCallback(async () => {
    const sid = getSessionId();
    if (!sid) { setLoading(false); return; }
    try {
      const res = await fetch(AUTH_URL, {
        method: "GET",
        headers: { "X-Session-Id": sid },
      });
      const data = await res.json();
      if (data.user) setUser(data.user);
      else { localStorage.removeItem(SESSION_KEY); setUser(null); }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMe(); }, [fetchMe]);

  const register = async (username: string, email: string, password: string) => {
    setError(null);
    const data = await authCall({ action: "register", username, email, password });
    if (data.error) { setError(data.error); return false; }
    localStorage.setItem(SESSION_KEY, data.session_id);
    await fetchMe();
    return true;
  };

  const login = async (login: string, password: string) => {
    setError(null);
    const data = await authCall({ action: "login", login, password });
    if (data.error) { setError(data.error); return false; }
    localStorage.setItem(SESSION_KEY, data.session_id);
    setUser(data.user);
    return true;
  };

  const logout = async () => {
    const sid = getSessionId();
    await authCall({ action: "logout", session_id: sid });
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return { user, loading, error, setError, register, login, logout };
}
