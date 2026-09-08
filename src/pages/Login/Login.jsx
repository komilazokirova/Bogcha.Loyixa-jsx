import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useState, useMemo, useRef, useCallback } from "react";
import {
  Eye, EyeOff, Mail, Lock, Loader2, Sparkles, ArrowRight,
  ShieldCheck, Briefcase, GraduationCap,
  Users, Wallet, Contact,
} from "lucide-react";
import { loginSchema } from "./loginSchema";
import useAuthStore from "../../store/authStore";
import { useTranslation } from "../../i18n/useTranslation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const roleOptions = [
  { value: "admin", icon: ShieldCheck },
  { value: "director", icon: Briefcase },
  { value: "teacher", icon: GraduationCap },
];

const roleAccent = {
  admin: { active: "bg-white text-sky border-white shadow-md" },
  director: { active: "bg-white text-bubblegum border-white shadow-md" },
  teacher: { active: "bg-white text-emerald-700 border-white shadow-md" },
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

  // ===== Kartaning yengil 3D "tilt" effekti (sichqoncha harakatiga qarab) =====
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -6, y: px * 8 });
  }, []);

  const resetTilt = useCallback(() => setTilt({ x: 0, y: 0 }), []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-sky via-bubblegum to-sun">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-72 h-72 rounded-full bg-white/20 blur-sm animate-float" />
        <div className="absolute top-1/4 -right-16 w-96 h-96 rounded-full bg-white/15 animate-float-slower" />
        <div className="absolute bottom-0 left-1/5 w-80 h-80 rounded-full bg-white/10 animate-float-slower" />
        <div className="absolute bottom-10 right-1/4 w-40 h-40 rounded-full bg-white/20 animate-float" />
        <div className="absolute top-1/2 left-10 w-24 h-24 rounded-full bg-white/20 animate-float" />
        <div className="absolute top-10 right-1/3 w-20 h-20 rounded-full bg-white/25 animate-float" />
        <div className="absolute bottom-1/3 right-10 w-28 h-28 rounded-full bg-white/15 animate-float-slower" />

        <Sparkles className="absolute top-[14%] left-[42%] text-white/40" size={22} />
        <Sparkles className="absolute top-[65%] left-[8%] text-white/30" size={16} />
        <Sparkles className="absolute top-[22%] right-[38%] text-white/30" size={14} />
        <Sparkles className="absolute bottom-[12%] right-[30%] text-white/25" size={18} />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-0 px-6 py-12 lg:px-16">
        <div className="w-full lg:w-1/2 max-w-md text-white text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-6 animate-login-fade">
            <div className="relative w-14 h-14 shrink-0">
              <div className="absolute inset-0 rounded-2xl bg-white/30 blur-md" />
              <div className="relative w-14 h-14 rounded-2xl bg-white/25 backdrop-blur-sm flex items-center justify-center text-3xl shadow-lg ring-1 ring-white/40">
                🌈
              </div>
            </div>
            <h1 className="font-display text-3xl font-bold drop-shadow">
              {t("appName")}
            </h1>
          </div>

          <h2
            className="font-display text-2xl sm:text-4xl font-bold mb-3 leading-tight drop-shadow-sm animate-login-fade"
            style={{ animationDelay: "0.08s" }}
          >
            {t("login.loginTitle")}
          </h2>
          <p
            className="text-white/90 text-sm sm:text-base mb-8 leading-relaxed max-w-sm mx-auto lg:mx-0 animate-login-fade"
            style={{ animationDelay: "0.14s" }}
          >
            {t("login.loginSubtitle")}
          </p>

          <div className="space-y-3 max-w-sm mx-auto lg:mx-0">
            {featureItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.key}
                  className="flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 text-left ring-1 ring-white/10 hover:bg-white/20 hover:translate-x-1 transition-all duration-300 animate-login-fade"
                  style={{ animationDelay: `${0.2 + i * 0.07}s` }}
                >
                  <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                    <Icon size={18} />
                  </div>
                  <span className="text-sm font-medium">{t(item.key)}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end" style={{ perspective: "1400px" }}>
          <Card
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={resetTilt}
            style={{
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition: "transform 0.15s ease-out",
            }}
            className="animate-login-card w-full max-w-md shadow-2xl shadow-black/10 border border-white/25 rounded-[28px] bg-white/15 backdrop-blur-sm overflow-hidden py-0 gap-0 will-change-transform"
          >
            <CardContent className="p-8 sm:p-10">
              <div className="text-center mb-7">
                <div className="relative w-14 h-14 mx-auto mb-3">
                  <div className="absolute inset-0 rounded-2xl bg-white/30 blur-md" />
                  <div className="relative w-14 h-14 rounded-2xl bg-white/25 backdrop-blur-sm flex items-center justify-center text-3xl shadow-lg ring-1 ring-white/40">
                    🌈
                  </div>
                </div>
                <h1 className="font-display text-2xl font-bold text-white drop-shadow-sm">
                  {t("login.loginTitle")}
                </h1>
                <p className="text-white/85 text-sm mt-1">{t("login.welcome")}</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-white font-medium">
                    {t("login.email")}
                  </Label>
                  <div className="group relative">
                    <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-sky" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("login.emailPlaceholder")}
                      className="h-12 pl-11 rounded-2xl border-0 bg-white/95 shadow-sm focus-visible:ring-2 focus-visible:ring-white/70 transition-all"
                      {...register("email")}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-100 bg-red-500/30 rounded-lg px-2 py-0.5 inline-block">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-white font-medium">
                    {t("login.password")}
                  </Label>
                  <div className="group relative">
                    <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-sky" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="h-12 pl-11 pr-11 rounded-2xl border-0 bg-white/95 shadow-sm focus-visible:ring-2 focus-visible:ring-white/70 transition-all"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-sky transition-colors cursor-pointer"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-100 bg-red-500/30 rounded-lg px-2 py-0.5 inline-block">{errors.password.message}</p>
                  )}
                </div>

                <div className="border-t border-white/25" />

                <div className="space-y-2">
                  <Label className="text-white font-medium">{t("login.roleLabel")}</Label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {roleOptions.map((opt) => {
                      const Icon = opt.icon;
                      const isActive = role === opt.value;
                      const accent = roleAccent[opt.value];
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setRole(opt.value)}
                          className={`flex flex-col items-center gap-2 rounded-2xl border-2 px-2 py-3.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                            isActive
                              ? `${accent.active} scale-[1.03]`
                              : "border-white/30 bg-white/10 text-white/80 hover:bg-white/20 hover:-translate-y-0.5"
                          }`}
                        >
                          <span className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${isActive ? "bg-current/10" : "bg-white/15"}`}>
                            <Icon size={17} />
                          </span>
                          {t("role." + opt.value)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {role === "teacher" && (
                  <div className="space-y-2 animate-login-fade">
                    <Label className="text-white font-medium">{t("login.groupLabel")}</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {["Yasli", "Kichik", "O'rta", "Katta"].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setTeacherGroup(g)}
                          className={`rounded-xl border-2 px-2 py-2 text-xs font-semibold transition-all cursor-pointer ${
                            teacherGroup === g ? "bg-white text-bubblegum border-white shadow-md" : "border-white/30 bg-white/10 text-white/80 hover:bg-white/20"
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <label className="flex items-center gap-2 text-sm text-white/90 cursor-pointer select-none pt-1">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded border-white/40 accent-white"
                  />
                  {t("login.rememberMe")}
                </label>

                {serverError && (
                  <p className="text-sm text-white text-center bg-red-500/40 rounded-xl py-2">
                    {serverError}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="group w-full rounded-2xl bg-white text-ink border-0 font-display text-base h-12 hover:bg-white hover:shadow-xl transition-all active:scale-[0.98] shadow-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 size={17} className="mr-2 animate-spin" />
                      {t("login.loggingIn")}
                    </>
                  ) : (
                    <>
                      {t("login.signIn")}
                      <ArrowRight size={17} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}