import { useState } from "react";
import Icon from "@/components/ui/icon";

interface AuthScreenProps {
  onLogin: (login: string, password: string) => Promise<boolean>;
  onRegister: (username: string, email: string, password: string) => Promise<boolean>;
  error: string | null;
  setError: (e: string | null) => void;
}

export default function AuthScreen({ onLogin, onRegister, error, setError }: AuthScreenProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", login: "", password: "" });

  const set = (k: string, v: string) => { setForm(f => ({ ...f, [k]: v })); setError(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (mode === "login") {
      await onLogin(form.login, form.password);
    } else {
      await onRegister(form.username, form.email, form.password);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#00f5ff]/5 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#a855f7]/5 blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
      </div>

      <div className="w-full max-w-sm relative">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00f5ff] to-[#a855f7] flex items-center justify-center mx-auto mb-4 shadow-[0_0_40px_rgba(0,245,255,0.3)]">
            <Icon name="Gamepad2" size={28} className="text-black" />
          </div>
          <h1 className="font-heading font-black text-2xl text-white">
            КРМП <span className="text-gradient-cyan">Launcher</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Войдите, чтобы продолжить</p>
        </div>

        {/* Card */}
        <div className="glass neon-border rounded-2xl p-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-white/5 rounded-xl mb-6">
            {(["login", "register"] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(null); }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  mode === m
                    ? "bg-[#00f5ff] text-black shadow-[0_0_16px_rgba(0,245,255,0.4)]"
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                {m === "login" ? "Войти" : "Регистрация"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div className="animate-fade-in">
                <label className="text-xs text-muted-foreground mb-1.5 block">Никнейм</label>
                <input
                  type="text"
                  value={form.username}
                  onChange={e => set("username", e.target.value)}
                  placeholder="RoadKing_777"
                  autoComplete="username"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-[#00f5ff]/50 focus:shadow-[0_0_0_3px_rgba(0,245,255,0.1)] transition-all"
                />
              </div>
            )}

            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">
                {mode === "register" ? "Email" : "Логин или Email"}
              </label>
              <input
                type={mode === "register" ? "email" : "text"}
                value={mode === "register" ? form.email : form.login}
                onChange={e => set(mode === "register" ? "email" : "login", e.target.value)}
                placeholder={mode === "register" ? "player@krmp.ru" : "roadking_777"}
                autoComplete={mode === "register" ? "email" : "username"}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-[#00f5ff]/50 focus:shadow-[0_0_0_3px_rgba(0,245,255,0.1)] transition-all"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Пароль</label>
              <input
                type="password"
                value={form.password}
                onChange={e => set("password", e.target.value)}
                placeholder="Минимум 6 символов"
                autoComplete={mode === "register" ? "new-password" : "current-password"}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-[#00f5ff]/50 focus:shadow-[0_0_0_3px_rgba(0,245,255,0.1)] transition-all"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/30 animate-fade-in">
                <Icon name="AlertCircle" size={14} className="text-red-400 flex-shrink-0" />
                <span className="text-xs text-red-400">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#00f5ff] text-black font-heading font-bold text-sm transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,245,255,0.5)] hover:scale-[1.02] disabled:opacity-60 disabled:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Icon name="Loader2" size={16} className="animate-spin" />
                  Загрузка...
                </>
              ) : mode === "login" ? (
                <>
                  <Icon name="LogIn" size={16} />
                  Войти
                </>
              ) : (
                <>
                  <Icon name="UserPlus" size={16} />
                  Создать аккаунт
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          КРМП Universe · Официальный лаунчер
        </p>
      </div>
    </div>
  );
}
