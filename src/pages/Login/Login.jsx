import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import {
  Eye, EyeOff, Mail, Lock, Loader2, ArrowRight,
  ShieldCheck, Briefcase, GraduationCap,
  Users, Wallet, Contact,
} from "lucide-react";
import { loginSchema } from "./loginSchema";
import useAuthStore from "../../store/authStore";
import { useTranslation } from "../../i18n/useTranslation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const roleOptions = [
  { value: "admin", icon: ShieldCheck },
  { value: "director", icon: Briefcase },
  { value: "teacher", icon: GraduationCap },
];

// MUHIM: klasslar TO'LIQ satr sifatida yozilgan (bo'lak-bo'lak birlashtirilmagan) —
// Tailwind build vaqtida faqat manba kodida SO'ZMA-SO'Z uchraydigan klass
// nomlarini generatsiya qiladi.
const roleAccent = {
  admin: {
    solid: "bg-sky",
    active: "border-transparent bg-sky/10 text-sky ring-1 ring-sky",
  },
  director: {
    solid: "bg-bubblegum",
    active: "border-transparent bg-bubblegum/10 text-bubblegum ring-1 ring-bubblegum",
  },
  teacher: {
    solid: "bg-grass",
    active: "border-transparent bg-grass/10 text-emerald-700 ring-1 ring-grass",
  },
};

const featureItems = [
  { icon: Users, key: "login.feature1" },
  { icon: Wallet, key: "login.feature2" },
  { icon: Contact, key: "login.feature3" },
];

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { t } = useTranslation();

  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("admin");
  const [teacherGroup, setTeacherGroup] = useState("Katta");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const schema = useMemo(() => loginSchema(t), [t]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setServerError("");
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const roleNames = {
        admin: t("role.admin"),
        director: t("role.director"),
        teacher: t("role.teacher"),
      };
      const mockUser = {
        name: displayName || roleNames[role],
        role,
        group: role === "teacher" ? teacherGroup : null,
      };
      const mockToken = "test-token-12345";
      login(mockUser, mockToken);
      navigate("/dashboard");
    } catch {
      setServerError(t("login.wrongCredentials"));
    } finally {
      setLoading(false);
    }
  };

  const accent = roleAccent[role];

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#EAF6FB]">
      {/* ============================================================
          FON: qog'oz-kitob uslubidagi manzara (quyosh, bulutlar, tepaliklar)
          ============================================================ */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden="true"
      >
        <rect width="1440" height="900" fill="#EAF6FB" />

        <circle cx="1230" cy="150" r="150" fill="#FDBA31" opacity="0.12" />
        <circle cx="1230" cy="150" r="95" fill="#FDBA31" opacity="0.18" />
        <circle cx="1230" cy="150" r="58" fill="#FDBA31" />

        <g opacity="0.85">
          <ellipse cx="220" cy="150" rx="70" ry="26" fill="#FFFFFF" />
          <ellipse cx="270" cy="138" rx="46" ry="22" fill="#FFFFFF" />
          <ellipse cx="175" cy="140" rx="42" ry="20" fill="#FFFFFF" />
        </g>
        <g opacity="0.7">
          <ellipse cx="620" cy="90" rx="52" ry="18" fill="#FFFFFF" />
          <ellipse cx="655" cy="82" rx="34" ry="15" fill="#FFFFFF" />
        </g>

        <path
          d="M0,620 C180,560 340,660 520,610 C700,560 820,650 1000,600 C1180,555 1300,630 1440,590 L1440,900 L0,900 Z"
          fill="#CDEFDD"
        />
        <path
          d="M0,720 C200,660 380,760 600,710 C820,660 980,750 1180,700 C1300,670 1380,690 1440,680 L1440,900 L0,900 Z"
          fill="#6FCF97"
        />

        <g fill="#57B682">
          <circle cx="180" cy="705" r="26" />
          <rect x="176" y="720" width="8" height="22" rx="3" />
          <circle cx="1080" cy="695" r="22" />
          <rect x="1076" y="708" width="7" height="20" rx="3" />
        </g>
      </svg>

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row items-center justify-center gap-14 lg:gap-10 px-6 py-14 lg:px-20">
        {/* ===== Chap tomon ===== */}
        <div className="w-full lg:w-[46%] max-w-md text-center lg:text-left">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center text-3xl">
              🌈
            </div>
            <h1 className="font-display text-3xl font-bold text-ink">
              {t("appName")}
            </h1>
          </div>

          <h2 className="font-display text-2xl sm:text-[28px] font-bold text-ink mb-3 leading-tight">
            {t("login.loginTitle")}
          </h2>
          <p className="text-ink/60 text-sm sm:text-base mb-8 leading-relaxed max-w-sm mx-auto lg:mx-0">
            {t("login.loginSubtitle")}
          </p>

          <div className="space-y-3 max-w-sm mx-auto lg:mx-0">
            {featureItems.map((item, i) => {
              const Icon = item.icon;
              const tint = [
                { bg: "bg-sky/15", text: "text-sky" },
                { bg: "bg-bubblegum/15", text: "text-bubblegum" },
                { bg: "bg-grass/20", text: "text-emerald-700" },
              ][i % 3];
              return (
                <div
                  key={item.key}
                  className="flex items-center gap-3 bg-white/80 rounded-2xl px-4 py-3 text-left shadow-sm border border-ink/5"
                >
                  <div className={`w-9 h-9 rounded-xl ${tint.bg} ${tint.text} flex items-center justify-center shrink-0`}>
                    <Icon size={17} />
                  </div>
                  <span className="text-sm font-semibold text-ink/80">{t(item.key)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== O'ng tomon: clipboard'ga qadalgan forma ===== */}
        <div className="w-full lg:w-[40%] flex justify-center">
          <div className="relative w-full max-w-sm">
            <div className="absolute left-1/2 -translate-x-1/2 -top-5 z-20 -rotate-2">
              <div className="w-24 h-10 rounded-xl bg-ink shadow-md flex items-center justify-center">
                <div className="w-14 h-4 rounded-md bg-white/10" />
              </div>
              <div className="w-4 h-4 rounded-full bg-[#E4E0D8] border-2 border-ink/20 absolute left-1/2 -translate-x-1/2 -top-1.5" />
            </div>

            <div className="relative bg-white rounded-[26px] border-2 border-ink/10 shadow-[10px_10px_0_0_rgba(45,42,50,0.06)] px-7 pt-10 pb-8 sm:px-8">
              <div className="text-center mb-6">
                <h1 className="font-display text-xl font-bold text-ink">
                  {t("login.loginTitle")}
                </h1>
                <p className="text-ink/50 text-sm mt-1">{t("login.welcome")}</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-ink/80">
                    {t("login.email")}
                  </Label>
                  <div className="group relative">
                    <Mail
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/30 transition-colors group-focus-within:text-sky"
                    />
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("login.emailPlaceholder")}
                      className="h-11 pl-10 rounded-xl border-ink/10 bg-[#FBFAF7] focus-visible:ring-2 focus-visible:ring-sky/40 focus-visible:border-sky/50 transition-all"
                      {...register("email")}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-500 pl-1">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-ink/80">
                    {t("login.password")}
                  </Label>
                  <div className="group relative">
                    <Lock
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/30 transition-colors group-focus-within:text-sky"
                    />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="h-11 pl-10 pr-10 rounded-xl border-ink/10 bg-[#FBFAF7] focus-visible:ring-2 focus-visible:ring-sky/40 focus-visible:border-sky/50 transition-all"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/30 hover:text-sky transition-colors cursor-pointer"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500 pl-1">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-ink/80">{t("login.roleLabel")}</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {roleOptions.map((opt) => {
                      const Icon = opt.icon;
                      const isActive = role === opt.value;
                      const optAccent = roleAccent[opt.value];
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setRole(opt.value)}
                          className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-2.5 text-[11px] font-semibold transition-all cursor-pointer ${
                            isActive ? optAccent.active : "border-ink/10 text-ink/40 hover:border-ink/20"
                          }`}
                        >
                          <Icon size={16} />
                          {t("role." + opt.value)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {role === "teacher" && (
                  <div className="space-y-1.5">
                    <Label className="text-ink/80">{t("login.groupLabel")}</Label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {["Yasli", "Kichik", "O'rta", "Katta"].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setTeacherGroup(g)}
                          className={`rounded-lg border px-1.5 py-1.5 text-[11px] font-semibold transition-all cursor-pointer ${
                            teacherGroup === g
                              ? "border-transparent bg-bubblegum/10 text-bubblegum ring-1 ring-bubblegum"
                              : "border-ink/10 text-ink/40 hover:border-ink/20"
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <label className="flex items-center gap-2 text-sm text-ink/60 cursor-pointer select-none pt-1">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded border-ink/20 accent-sky"
                  />
                  {t("login.rememberMe")}
                </label>

                {serverError && (
                  <p className="text-sm text-red-500 text-center bg-red-50 rounded-xl py-2">
                    {serverError}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className={`w-full rounded-xl text-white border-0 font-display text-[15px] h-11 transition-all active:scale-[0.98] shadow-md ${accent.solid} hover:brightness-105`}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      {t("login.loggingIn")}
                    </>
                  ) : (
                    <>
                      {t("login.signIn")}
                      <ArrowRight size={16} className="ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}