import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import {
  Eye, EyeOff, Mail, Lock, Loader2, Sparkles,
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

// Rol tanlash uchun tugmachalar konfiguratsiyasi
const roleOptions = [
  { value: "admin", icon: ShieldCheck },
  { value: "director", icon: Briefcase },
  { value: "teacher", icon: GraduationCap },
];

// Chap paneldagi xususiyatlar ro'yxati
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

  return (
    <div className="min-h-screen flex bg-cream dark:bg-gray-950">
      {/* ===== Chap panel (faqat katta ekranda) ===== */}
      <div className="hidden lg:flex lg:w-[46%] relative overflow-hidden bg-gradient-to-br from-sky via-bubblegum to-sun flex-col justify-center px-14 py-16 text-white">
        {/* Suzib yuruvchi shakllar */}
        <div className="absolute top-16 left-12 w-32 h-32 rounded-full bg-white/20 animate-float" />
        <div className="absolute bottom-24 right-12 w-40 h-40 rounded-full bg-white/15 animate-float-slower" />
        <div className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-white/20 animate-float" />

        <div className="relative z-10 max-w-md">
          {/* Logo va nom */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-white/25 backdrop-blur-sm flex items-center justify-center text-3xl shadow-lg">
              🌈
            </div>
            <h1 className="font-display text-3xl font-bold drop-shadow">
              {t("appName")}
            </h1>
          </div>

          <h2 className="font-display text-2xl font-bold mb-3 leading-tight">
            {t("login.loginTitle")}
          </h2>
          <p className="text-white/90 text-sm mb-8 leading-relaxed">
            {t("login.loginSubtitle")}
          </p>

          {/* Xususiyatlar */}
          <div className="space-y-3">
            {featureItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.key}
                  className="flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3"
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
      </div>

      {/* ===== O'ng panel: forma ===== */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-2xl border-0 rounded-3xl">
          <CardContent className="p-8">
            {/* Mobil uchun kichik logotip */}
            <div className="lg:hidden flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-sun/20 flex items-center justify-center text-3xl mb-2">
                🌈
              </div>
              <h1 className="font-display text-2xl font-bold text-sky">
                {t("appName")}
              </h1>
              <p className="text-sm text-gray-500 mt-1">{t("login.welcome")}</p>
            </div>

            {/* Katta ekranda sarlavha */}
            <div className="hidden lg:block mb-6">
              <h1 className="font-display text-2xl font-bold text-ink dark:text-gray-100">
                {t("login.loginTitle")}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                {t("login.welcome")}
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">{t("login.email")}</Label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("login.emailPlaceholder")}
                    className="pl-9 rounded-xl"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Parol */}
              <div className="space-y-2">
                <Label htmlFor="password">{t("login.password")}</Label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-9 pr-10 rounded-xl"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              {/* Rol tanlash — test uchun */}
              <div className="space-y-2">
                <Label>{t("login.roleLabel")}</Label>
                <div className="grid grid-cols-3 gap-2">
                  {roleOptions.map((opt) => {
                    const Icon = opt.icon;
                    const isActive = role === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setRole(opt.value)}
                        className={`flex flex-col items-center gap-1.5 rounded-xl border-2 px-2 py-3 text-xs font-semibold transition-all cursor-pointer ${
                          isActive
                            ? "border-sky bg-sky/10 text-sky"
                            : "border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                      >
                        <Icon size={18} />
                        {t("role." + opt.value)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tarbiyachi uchun guruh tanlash */}
              {role === "teacher" && (
                <div className="space-y-2">
                  <Label>{t("login.groupLabel")}</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {["Yasli", "Kichik", "O'rta", "Katta"].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setTeacherGroup(g)}
                        className={`rounded-lg border-2 px-2 py-2 text-xs font-semibold transition-all cursor-pointer ${
                          teacherGroup === g
                            ? "border-bubblegum bg-bubblegum/10 text-bubblegum"
                            : "border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Eslab qolish */}
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 accent-sky"
                />
                {t("login.rememberMe")}
              </label>

              {serverError && (
                <p className="text-sm text-red-500 text-center">{serverError}</p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-sky to-bubblegum text-white border-0 font-display text-base h-11 hover:opacity-90 transition-all active:scale-[0.99] shadow-lg shadow-sky/20"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    {t("login.loggingIn")}
                  </>
                ) : (
                  <>
                    <Sparkles size={16} className="mr-2" />
                    {t("login.signIn")}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}