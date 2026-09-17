import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  GraduationCap,
  Sun,
  Moon,
  Sparkles,
} from "lucide-react";
import { loginSchema } from "./loginSchema";
import useAuthStore from "../../store/authStore";
import useThemeStore from "../../store/themeStore";
import { useTranslation } from "../../i18n/useTranslation";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Demo ma'lumotlar
const DEMO_ACCOUNTS = {
  admin: {
    email: "admin@bogcha.uz",
    password: "password123",
    name: "Admin",
    title: "Admin",
    color: "sky",
  },
  director: {
    email: "direktor@bogcha.uz",
    password: "password123",
    name: "Dilnoza Mudira",
    title: "Direktor",
    color: "bubblegum",
  },
  teacher: {
    email: "tarbiyachi@bogcha.uz",
    password: "password123",
    name: "Nodira Tarbiyachi",
    title: "Tarbiyachi",
    color: "grass",
  },
};

const roleTabs = [
  { id: "admin", label: "Admin", icon: ShieldCheck, emoji: "🛡️" },
  { id: "director", label: "Direktor", icon: Briefcase, emoji: "💼" },
  { id: "teacher", label: "Tarbiyachi", icon: GraduationCap, emoji: "👩‍🏫" },
];

const teacherGroups = [
  { id: "Yasli", label: "Yasli", emoji: "👶" },
  { id: "Kichik", label: "Kichik", emoji: "🧸" },
  { id: "O'rta", label: "O'rta", emoji: "🎨" },
  { id: "Katta", label: "Katta", emoji: "🚀" },
];

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { theme, toggleTheme } = useThemeStore();
  const { t } = useTranslation();

  const [role, setRole] = useState("admin");
  const [teacherGroup, setTeacherGroup] = useState("Katta");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const schema = useMemo(() => loginSchema(t), [t]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: DEMO_ACCOUNTS.admin.email,
      password: DEMO_ACCOUNTS.admin.password,
    },
  });

  // Rol bosilganda tegishli test hisobini kiritish
  const handleSelectRole = (roleId) => {
    setRole(roleId);
    setServerError("");
    const account = DEMO_ACCOUNTS[roleId];
    if (account) {
      setValue("email", account.email, { shouldValidate: true });
      setValue("password", account.password, { shouldValidate: true });
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 350));
      const roleNames = {
        admin: t("role.admin"),
        director: t("role.director"),
        teacher: t("role.teacher"),
      };
      const account = DEMO_ACCOUNTS[role];
      const mockUser = {
        name: account?.name || roleNames[role],
        role,
        group: role === "teacher" ? teacherGroup : null,
        email: data.email,
      };
      login(mockUser, "token-" + Date.now());
      navigate("/dashboard");
    } catch {
      setServerError(t("login.wrongCredentials"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen max-h-screen w-full overflow-hidden relative flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#D4EEFC] via-[#FDF5E6] to-[#DCF5E3] dark:from-[#0B1220] dark:via-[#0F172A] dark:to-[#0D1E18] select-none">
      {/* ================= CHIROYLI BOG'CHA FON BEZAKLARI (BACKGROUND) ================= */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">
        {/* Quyosh (Yorug'lik nurlari bilan) */}
        <div className="absolute top-6 left-8 sm:left-14">
          <div className="relative flex items-center justify-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-amber-300/40 dark:bg-amber-400/10 blur-xl animate-pulse-glow" />
            <div className="absolute w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 shadow-lg shadow-amber-300/50 flex items-center justify-center text-2xl">
              ☀️
            </div>
          </div>
        </div>

        {/* Kamalak (Rainbow) */}
        <div className="hidden md:block absolute -top-10 right-10 lg:right-28 opacity-65 dark:opacity-25 pointer-events-none">
          <svg width="340" height="200" viewBox="0 0 340 200" fill="none">
            <path d="M 30 190 A 140 140 0 0 1 310 190" stroke="#FF7AA8" strokeWidth="10" strokeLinecap="round" opacity="0.8" />
            <path d="M 42 190 A 128 128 0 0 1 298 190" stroke="#FDBA31" strokeWidth="10" strokeLinecap="round" opacity="0.8" />
            <path d="M 54 190 A 116 116 0 0 1 286 190" stroke="#6FCF97" strokeWidth="10" strokeLinecap="round" opacity="0.8" />
            <path d="M 66 190 A 104 104 0 0 1 274 190" stroke="#4FB6E8" strokeWidth="10" strokeLinecap="round" opacity="0.8" />
            <path d="M 78 190 A 92 92 0 0 1 262 190" stroke="#A78BFA" strokeWidth="10" strokeLinecap="round" opacity="0.8" />
          </svg>
        </div>

        {/* Suzuvchi bulutlar */}
        <div className="absolute top-16 right-1/4 opacity-80 dark:opacity-30 animate-float-gentle">
          <svg width="110" height="45" viewBox="0 0 120 50" fill="none">
            <path
              d="M25 40h70a15 15 0 0 0 5-29 20 20 0 0 0-38-6 16 16 0 0 0-30 11 12 12 0 0 0-7 24z"
              fill="white"
              className="drop-shadow-sm"
            />
          </svg>
        </div>
        <div className="hidden sm:block absolute top-28 left-1/3 opacity-70 dark:opacity-20 animate-float-slower">
          <svg width="130" height="55" viewBox="0 0 140 60" fill="none">
            <path
              d="M30 48h80a16 16 0 0 0 6-31 22 22 0 0 0-42-7 18 18 0 0 0-34 12 14 14 0 0 0-10 26z"
              fill="white"
              className="drop-shadow-sm"
            />
          </svg>
        </div>

        {/* Issiq havo shari (Hot Air Balloon) */}
        <div className="hidden lg:block absolute top-24 left-1/5 opacity-85 dark:opacity-40 animate-float">
          <div className="flex flex-col items-center">
            <div className="w-12 h-15 rounded-t-full rounded-b-[40%] bg-gradient-to-b from-bubblegum via-sun to-sky shadow-md flex items-center justify-center text-white text-xs font-bold">
              🎈
            </div>
            <div className="w-5 h-3 border-x border-b border-amber-800/60 mt-1 rounded-xs bg-amber-700/20" />
          </div>
        </div>

        {/* Osmondagi porloq yulduzchalar */}
        <Sparkles className="absolute top-20 right-1/3 text-amber-400/80 dark:text-amber-300/40 animate-pulse" size={22} />
        <Sparkles className="absolute top-44 left-12 text-sky-500/70 dark:text-sky-300/40 animate-pulse" size={18} />
        <Sparkles className="absolute top-36 right-16 text-pink-400/70 dark:text-pink-300/40 animate-pulse" size={20} />

        {/* Pastdagi yashil bog'cha tepaliklari (Rolling Hills & Nature) */}
        <div className="absolute bottom-0 inset-x-0 h-36 pointer-events-none">
          {/* Orqa tepalik */}
          <svg className="absolute bottom-0 w-full h-32" preserveAspectRatio="none" viewBox="0 0 1200 120">
            <path
              d="M0,60 C250,10 450,110 700,50 C950,-10 1100,70 1200,40 L1200,120 L0,120 Z"
              fill="#A9DFBF"
              className="dark:fill-[#122A1E] opacity-70"
            />
          </svg>
          {/* Oldingi tepalik */}
          <svg className="absolute bottom-0 w-full h-24" preserveAspectRatio="none" viewBox="0 0 1200 90">
            <path
              d="M0,40 C300,80 500,20 800,50 C1000,70 1100,30 1200,45 L1200,90 L0,90 Z"
              fill="#6FCF97"
              className="dark:fill-[#173826] opacity-90"
            />
          </svg>
          {/* Kichik gullar */}
          <div className="absolute bottom-3 left-10 text-lg opacity-80">🌸</div>
          <div className="absolute bottom-4 left-1/4 text-base opacity-75">🌼</div>
          <div className="absolute bottom-3 right-1/3 text-lg opacity-80">🌷</div>
          <div className="absolute bottom-5 right-12 text-base opacity-75">🌻</div>
        </div>
      </div>

      {/* ================= YUQORI O'NG BURCHAK: TIL VA MAVZU ================= */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 flex items-center gap-2">
        <div className="rounded-2xl border border-white/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-0.5 shadow-sm">
          <LanguageSwitcher />
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          className="p-2.5 rounded-2xl border border-white/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-700 dark:text-amber-400 hover:scale-105 transition-all shadow-sm cursor-pointer"
          title="Mavzuni o'zgartirish"
        >
          {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </div>

      {/* ================= MARKAZIY LOGIN KARTA (FOCUSED & SKROLSIZ) ================= */}
      <div className="relative z-20 w-full max-w-[390px] sm:max-w-[420px] mx-auto">
        <div className="bg-white/85 dark:bg-slate-900/90 backdrop-blur-2xl border-2 border-white/90 dark:border-slate-800/90 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)] rounded-3xl p-6 sm:p-7 space-y-4">
          {/* Logo va Sarlavha */}
          <div className="text-center space-y-1">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 via-pink-400 to-amber-300 shadow-md shadow-sky-400/20 text-2xl mx-auto mb-1">
              🌈
            </div>
            <h1 className="font-display text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              {t("appName")}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {t("login.loginTitle")}
            </p>
          </div>

          {/* 1. ROL (Role Selector) */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>{t("login.roleLabel")}</span>
              <span className="text-[10px] text-sky-600 dark:text-sky-400 font-medium">
                Sinov hisobi
              </span>
            </Label>

            <div className="grid grid-cols-3 p-1 rounded-2xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60">
              {roleTabs.map((tab) => {
                const isActive = role === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleSelectRole(tab.id)}
                    className={`flex items-center justify-center gap-1.5 py-2 px-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm scale-[1.02]"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                    }`}
                  >
                    <span className="text-xs">{tab.emoji}</span>
                    <span>{t(`role.${tab.id}`)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tarbiyachi tanlanganda: Guruh qatori */}
          {role === "teacher" && (
            <div className="flex items-center justify-between p-1.5 px-2.5 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 animate-in fade-in duration-200">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                Guruh:
              </span>
              <div className="flex gap-1">
                {teacherGroups.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setTeacherGroup(g.id)}
                    className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      teacherGroup === g.id
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
                    }`}
                  >
                    {g.emoji} {g.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 2. FORMA: EMAIL VA PASVORD */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
            {/* Email */}
            <div className="space-y-1">
              <Label
                htmlFor="email"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                {t("login.email")}
              </Label>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@bogcha.uz"
                  className="h-10 pl-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-xs sm:text-sm focus-visible:ring-2 focus-visible:ring-sky-500"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-red-500 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Pasvord (Password) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  {t("login.password")}
                </Label>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                  Parol: <b className="text-slate-600 dark:text-slate-300 font-mono">123456</b>
                </span>
              </div>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-10 pl-10 pr-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-xs sm:text-sm focus-visible:ring-2 focus-visible:ring-sky-500"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-600 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-red-500 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Eslab qolish */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500 accent-sky-600"
                />
                <span>{t("login.rememberMe")}</span>
              </label>

              <button
                type="button"
                onClick={() => handleSelectRole(role)}
                className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
              >
                Avto-to'ldirish
              </button>
            </div>

            {/* Server xatosi */}
            {serverError && (
              <div className="p-2 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs text-center font-semibold">
                {serverError}
              </div>
            )}

            {/* Kirish tugmasi */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 transition-all duration-200 cursor-pointer group flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>{t("login.loggingIn")}</span>
                </>
              ) : (
                <>
                  <span>{t("login.signIn")}</span>
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}