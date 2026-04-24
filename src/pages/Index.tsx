import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

type Tab = "home" | "profile" | "settings" | "help";

const MODS = [
  { id: 1, name: "Enhanced Graphics Pack", version: "2.4.1", size: "1.2 GB", status: "installed", category: "Графика" },
  { id: 2, name: "Roleplay UI Extended", version: "1.8.0", size: "340 MB", status: "update", category: "Интерфейс" },
  { id: 3, name: "Sound FX Ultra", version: "3.0.2", size: "890 MB", status: "installed", category: "Звук" },
  { id: 4, name: "Vehicle Physics Pro", version: "1.5.0", size: "220 MB", status: "available", category: "Транспорт" },
  { id: 5, name: "Map Extension v2", version: "2.1.3", size: "560 MB", status: "installed", category: "Карта" },
  { id: 6, name: "Anti-Cheat Shield", version: "4.0.0", size: "45 MB", status: "update", category: "Безопасность" },
];

const ACHIEVEMENTS = [
  { icon: "🏆", label: "Ветеран", desc: "1000+ часов в игре" },
  { icon: "🚗", label: "Гонщик", desc: "500 заездов" },
  { icon: "💼", label: "Бизнесмен", desc: "1M$ заработано" },
  { icon: "🤝", label: "Дипломат", desc: "100 фракций" },
];

const FAQ = [
  { q: "Как обновить моды автоматически?", a: "Включите автообновление в разделе Настройки → Обновления. Лаунчер будет проверять новые версии при каждом запуске." },
  { q: "Лаунчер не запускает игру", a: "Убедитесь, что путь к игре указан верно в Настройки → Пути. Запустите лаунчер от имени администратора." },
  { q: "Как откатить мод к предыдущей версии?", a: "В разделе Моды нажмите на мод → История версий → выберите нужную версию и нажмите Установить." },
  { q: "Ошибка при загрузке мода", a: "Проверьте соединение с интернетом и свободное место на диске. Попробуйте очистить кеш в Настройки → Кеш → Очистить." },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string }> = {
    installed: { label: "Установлен", color: "text-[#39ff14] bg-[#39ff14]/10 border-[#39ff14]/30" },
    update: { label: "Обновить", color: "text-[#ff9500] bg-[#ff9500]/10 border-[#ff9500]/30" },
    available: { label: "Доступен", color: "text-[#00f5ff] bg-[#00f5ff]/10 border-[#00f5ff]/30" },
  };
  const s = map[status] || map.available;
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${s.color}`}>
      {s.label}
    </span>
  );
}

function ProgressBar({ value, color = "cyan" }: { value: number; color?: string }) {
  const grad = color === "violet"
    ? "linear-gradient(90deg, #a855f7, #ec4899)"
    : "linear-gradient(90deg, #00f5ff, #a855f7)";
  return (
    <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-1000"
        style={{ width: `${value}%`, background: grad }}
      />
    </div>
  );
}

function HomeTab() {
  const [downloading, setDownloading] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  const handleAction = (mod: typeof MODS[0]) => {
    if (mod.status === "installed") return;
    setDownloading(mod.id);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setDownloading(null);
          return 0;
        }
        return p + Math.random() * 8;
      });
    }, 150);
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl glass neon-border scanlines">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00f5ff]/10 via-transparent to-[#a855f7]/10" />
        <div className="relative p-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full status-online" />
              <span className="text-xs text-[#39ff14] font-semibold tracking-widest uppercase">Сервер онлайн</span>
            </div>
            <h2 className="font-heading font-black text-2xl text-white mb-1">
              КРМП <span className="text-gradient-cyan">Universe</span>
            </h2>
            <p className="text-muted-foreground text-sm">Версия лаунчера 3.2.1 · Последнее обновление сегодня</p>
          </div>
          <button className="px-6 py-3 rounded-xl font-heading font-bold text-sm bg-[#00f5ff] text-black transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,245,255,0.5)] flex items-center gap-2">
            <Icon name="Play" size={16} />
            ИГРАТЬ
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: "Package", label: "Модов", value: "12", sub: "установлено", color: "#00f5ff" },
          { icon: "Download", label: "Обновлений", value: "2", sub: "доступно", color: "#ff9500" },
          { icon: "HardDrive", label: "Занято", value: "18.4", sub: "ГБ на диске", color: "#a855f7" },
        ].map((stat, i) => (
          <div key={i} className="glass neon-border rounded-xl p-4 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <Icon name={stat.icon} size={14} style={{ color: stat.color }} />
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <div className="font-heading font-black text-2xl text-white">{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{stat.sub}</div>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading font-bold text-sm uppercase tracking-widest text-muted-foreground">Моды и плагины</h3>
          <button className="text-xs text-[#00f5ff] hover:text-white transition-colors flex items-center gap-1">
            <Icon name="RefreshCw" size={12} />
            Проверить обновления
          </button>
        </div>
        <div className="space-y-2">
          {MODS.map((mod) => (
            <div key={mod.id} className="glass neon-border rounded-xl p-4 flex items-center gap-4 animate-fade-in">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00f5ff]/20 to-[#a855f7]/20 flex items-center justify-center flex-shrink-0">
                <Icon name="Box" size={18} className="text-[#00f5ff]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-white truncate mb-0.5">{mod.name}</div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>v{mod.version}</span>
                  <span>{mod.size}</span>
                  <span className="px-1.5 py-0.5 rounded bg-white/5">{mod.category}</span>
                </div>
                {downloading === mod.id && (
                  <div className="mt-2">
                    <ProgressBar value={Math.min(progress, 100)} />
                    <span className="text-xs text-[#00f5ff] mt-1 block">{Math.min(Math.round(progress), 100)}%</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <StatusBadge status={mod.status} />
                {mod.status !== "installed" && downloading !== mod.id && (
                  <button
                    onClick={() => handleAction(mod)}
                    className="w-8 h-8 rounded-lg bg-[#00f5ff]/10 hover:bg-[#00f5ff]/20 border border-[#00f5ff]/30 flex items-center justify-center transition-all hover:scale-110"
                  >
                    <Icon name={mod.status === "update" ? "RefreshCw" : "Download"} size={14} className="text-[#00f5ff]" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfileTab() {
  return (
    <div className="space-y-6">
      <div className="glass neon-border rounded-2xl p-6 scanlines relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#a855f7]/10 via-transparent to-[#00f5ff]/5" />
        <div className="relative flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00f5ff] to-[#a855f7] flex items-center justify-center text-3xl font-heading font-black text-black">
              RK
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#39ff14] border-2 border-background status-online" />
          </div>
          <div className="flex-1">
            <h2 className="font-heading font-black text-xl text-white">RoadKing_777</h2>
            <p className="text-muted-foreground text-sm mb-3">ID: #4892 · VIP Игрок · Ранг: Легенда</p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Уровень 87</span>
              <div className="flex-1 max-w-32">
                <ProgressBar value={73} />
              </div>
              <span className="text-xs text-[#00f5ff]">73%</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-heading font-black text-gradient-cyan">1,842</div>
            <div className="text-xs text-muted-foreground">часа в игре</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: "🎯", label: "Сессий сыграно", value: "3,241" },
          { icon: "💰", label: "Заработано", value: "$2.4M" },
          { icon: "🚗", label: "Пройдено км", value: "48,200" },
          { icon: "⭐", label: "Репутация", value: "9,800" },
        ].map((stat, i) => (
          <div key={i} className="glass neon-border rounded-xl p-4 animate-fade-in">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="font-heading font-black text-xl text-white">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="glass neon-border rounded-xl p-5">
        <h3 className="font-heading font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4">Навыки</h3>
        <div className="space-y-4">
          {[
            { name: "Вождение", value: 92 },
            { name: "Стрельба", value: 78 },
            { name: "Торговля", value: 65 },
            { name: "Харизма", value: 88 },
          ].map((skill, i) => (
            <div key={i}>
              <div className="flex justify-between mb-1.5">
                <span className="text-sm text-white/80">{skill.name}</span>
                <span className="text-xs text-[#00f5ff] font-semibold">{skill.value}</span>
              </div>
              <ProgressBar value={skill.value} color={i % 2 === 0 ? "cyan" : "violet"} />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-heading font-bold text-sm uppercase tracking-widest text-muted-foreground mb-3">Достижения</h3>
        <div className="grid grid-cols-2 gap-2">
          {ACHIEVEMENTS.map((ach, i) => (
            <div key={i} className="glass neon-border rounded-xl p-3 flex items-center gap-3 animate-fade-in">
              <span className="text-2xl">{ach.icon}</span>
              <div>
                <div className="font-semibold text-sm text-white">{ach.label}</div>
                <div className="text-xs text-muted-foreground">{ach.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SettingsTab() {
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [discordRpc, setDiscordRpc] = useState(false);
  const [resolution, setResolution] = useState("1920x1080");
  const [lang, setLang] = useState("ru");

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-all duration-300 ${value ? "bg-[#00f5ff]" : "bg-white/10"}`}
    >
      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${value ? "left-6" : "left-1"}`} />
    </button>
  );

  return (
    <div className="space-y-4">
      <div className="glass neon-border rounded-xl p-5">
        <h3 className="font-heading font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4">Пути</h3>
        <div className="space-y-3">
          {[
            { label: "Путь к игре", val: "C:\\Games\\SAMP\\gta_sa.exe" },
            { label: "Папка модов", val: "C:\\Games\\SAMP\\mods\\" },
          ].map((p, i) => (
            <div key={i}>
              <label className="text-xs text-muted-foreground mb-1.5 block">{p.label}</label>
              <div className="flex gap-2">
                <div className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-muted-foreground truncate">
                  {p.val}
                </div>
                <button className="px-3 py-2 rounded-lg bg-[#00f5ff]/10 border border-[#00f5ff]/30 text-[#00f5ff] text-xs hover:bg-[#00f5ff]/20 transition-colors whitespace-nowrap">
                  Обзор
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass neon-border rounded-xl p-5">
        <h3 className="font-heading font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4">Дисплей</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Разрешение</label>
            <select
              value={resolution}
              onChange={e => setResolution(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00f5ff]/50"
            >
              {["1280x720", "1920x1080", "2560x1440", "3840x2160"].map(r => (
                <option key={r} value={r} className="bg-[#0d0f14]">{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Язык интерфейса</label>
            <select
              value={lang}
              onChange={e => setLang(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00f5ff]/50"
            >
              <option value="ru" className="bg-[#0d0f14]">Русский</option>
              <option value="en" className="bg-[#0d0f14]">English</option>
              <option value="ua" className="bg-[#0d0f14]">Українська</option>
            </select>
          </div>
        </div>
      </div>

      <div className="glass neon-border rounded-xl p-5">
        <h3 className="font-heading font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4">Общие</h3>
        <div className="space-y-4">
          {[
            { label: "Автообновление модов", desc: "Проверять обновления при запуске", value: autoUpdate, onChange: setAutoUpdate },
            { label: "Уведомления", desc: "Push-уведомления о статусе серверов", value: notifications, onChange: setNotifications },
            { label: "Discord Rich Presence", desc: "Показывать статус в Discord", value: discordRpc, onChange: setDiscordRpc },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm text-white">{item.label}</div>
                <div className="text-xs text-muted-foreground">{item.desc}</div>
              </div>
              <Toggle value={item.value} onChange={item.onChange} />
            </div>
          ))}
        </div>
      </div>

      <div className="glass border border-red-500/20 rounded-xl p-5">
        <h3 className="font-heading font-bold text-sm uppercase tracking-widest text-red-400 mb-4">Опасная зона</h3>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm hover:bg-red-500/20 transition-colors">
            Сбросить настройки
          </button>
          <button className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm hover:bg-red-500/20 transition-colors">
            Очистить кеш
          </button>
        </div>
      </div>
    </div>
  );
}

function HelpTab() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: "MessageCircle", label: "Чат поддержки", desc: "Онлайн 24/7", color: "#00f5ff" },
          { icon: "BookOpen", label: "Документация", desc: "Полное руководство", color: "#a855f7" },
          { icon: "Youtube", label: "Видео-гайды", desc: "Обучающие ролики", color: "#ff006e" },
          { icon: "Users", label: "Сообщество", desc: "Discord-сервер", color: "#39ff14" },
        ].map((item, i) => (
          <button key={i} className="glass neon-border rounded-xl p-4 text-left hover:scale-105 transition-all duration-200 animate-fade-in">
            <Icon name={item.icon} size={20} style={{ color: item.color }} className="mb-2" />
            <div className="font-semibold text-sm text-white">{item.label}</div>
            <div className="text-xs text-muted-foreground">{item.desc}</div>
          </button>
        ))}
      </div>

      <div>
        <h3 className="font-heading font-bold text-sm uppercase tracking-widest text-muted-foreground mb-3">Частые вопросы</h3>
        <div className="space-y-2">
          {FAQ.map((item, i) => (
            <div key={i} className="glass neon-border rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
              >
                <span className="text-sm text-white font-medium pr-4">{item.q}</span>
                <Icon
                  name="ChevronDown"
                  size={16}
                  className={`text-[#00f5ff] flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`}
                />
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 text-sm text-muted-foreground border-t border-white/5 pt-3 animate-fade-in">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="glass neon-border rounded-xl p-5">
        <h3 className="font-heading font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4">Статус серверов</h3>
        <div className="space-y-3">
          {[
            { name: "Основной сервер", status: "ok" },
            { name: "Сервер обновлений", status: "ok" },
            { name: "CDN (моды)", status: "ok" },
            { name: "API авторизации", status: "warn" },
          ].map((srv, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-sm text-white/80">{srv.name}</span>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${srv.status === "ok" ? "bg-[#39ff14] shadow-[0_0_6px_#39ff14]" : "bg-[#ff9500] shadow-[0_0_6px_#ff9500]"}`} />
                <span className={`text-xs font-semibold ${srv.status === "ok" ? "text-[#39ff14]" : "text-[#ff9500]"}`}>
                  {srv.status === "ok" ? "Работает" : "Замедлен"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center py-4">
        <div className="text-xs text-muted-foreground">КРМП Launcher v3.2.1 · © 2024 КРМП Universe</div>
        <div className="text-xs text-muted-foreground mt-1">Build #4821 · <span className="text-[#00f5ff]">Последняя версия</span></div>
      </div>
    </div>
  );
}

const NAV_ITEMS: { id: Tab; icon: string; label: string }[] = [
  { id: "home", icon: "Home", label: "Главная" },
  { id: "profile", icon: "User", label: "Профиль" },
  { id: "settings", icon: "Settings", label: "Настройки" },
  { id: "help", icon: "HelpCircle", label: "Справка" },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen gradient-bg flex flex-col">
      <header className="glass border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00f5ff] to-[#a855f7] flex items-center justify-center">
            <Icon name="Gamepad2" size={16} className="text-black" />
          </div>
          <span className="font-heading font-black text-sm text-white">КРМП</span>
          <span className="font-heading font-black text-sm text-gradient-cyan">Launcher</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-full border border-white/5">
            <div className="w-1.5 h-1.5 rounded-full status-online" />
            <span className="text-xs text-white/70">3,842 онлайн</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00f5ff] to-[#a855f7] flex items-center justify-center text-xs font-heading font-black text-black">
            RK
          </div>
        </div>
      </header>

      <main className="flex-1 flex">
        <aside className="w-16 glass border-r border-white/5 flex flex-col items-center py-6 gap-2 sticky top-[65px] h-[calc(100vh-65px)]">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={item.label}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 relative ${
                activeTab === item.id
                  ? "bg-[#00f5ff]/15 text-[#00f5ff] shadow-[0_0_16px_rgba(0,245,255,0.2)]"
                  : "text-muted-foreground hover:text-white hover:bg-white/5"
              }`}
            >
              {activeTab === item.id && (
                <span className="absolute left-0 w-0.5 h-6 bg-[#00f5ff] rounded-r-full shadow-[0_0_8px_rgba(0,245,255,0.8)]" />
              )}
              <Icon name={item.icon} size={18} />
            </button>
          ))}
        </aside>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-6 py-6">
            <div className={`mb-6 ${mounted ? "animate-fade-in" : "opacity-0"}`}>
              <h1 className="font-heading font-black text-2xl text-white">
                {NAV_ITEMS.find(n => n.id === activeTab)?.label}
              </h1>
              <div className="w-12 h-0.5 bg-gradient-to-r from-[#00f5ff] to-[#a855f7] rounded-full mt-2" />
            </div>

            <div key={activeTab} className={mounted ? "animate-fade-in" : "opacity-0"}>
              {activeTab === "home" && <HomeTab />}
              {activeTab === "profile" && <ProfileTab />}
              {activeTab === "settings" && <SettingsTab />}
              {activeTab === "help" && <HelpTab />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}