import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, UsersRound, Wallet, Contact, CalendarCheck,
  Settings, LogOut, Menu, X, Sun, Moon,
  ShieldCheck, Briefcase, GraduationCap, ChevronDown
} from "lucide-react";
import useAuthStore from "../store/authStore";
import useThemeStore from "../store/themeStore";
import { cn } from "../lib/utils";
import { useState } from "react";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useTranslation } from "../i18n/useTranslation";
import { canAccess } from "../lib/roles";

export default function MainLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const setRole = useAuthStore((state) => state.setRole);
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const { t } = useTranslation();

  const role = user?.role;
  const isTeacher = role === "teacher";

  const availableRoles = [
    { value: "admin", label: t("role.admin"), icon: ShieldCheck },
    { value: "director", label: t("role.director"), icon: Briefcase },
    { value: "teacher", label: t("role.teacher"), icon: GraduationCap },
  ];

  const menuItems = [
    { label: t("nav.dashboard"), path: "/dashboard", icon: LayoutDashboard, color: "text-sky", bg: "bg-sky/10", permission: "dashboard" },
    { label: t("nav.children"), path: "/children", icon: Users, color: "text-bubblegum", bg: "bg-bubblegum/10", permission: "children" },
    { label: t("nav.groups"), path: "/groups", icon: UsersRound, color: "text-grass", bg: "bg-grass/10", permission: "groups" },
    { label: t("nav.payments"), path: "/payments", icon: Wallet, color: "text-amber-500", bg: "bg-sun/10", permission: "payments" },
    { label: t("nav.staff"), path: "/staff", icon: Contact, color: "text-sky", bg: "bg-sky/10", permission: "staff" },
    { label: t("nav.attendance"), path: "/attendance", icon: CalendarCheck, color: "text-bubblegum", bg: "bg-bubblegum/10", permission: "attendance" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-cream dark:bg-gray-950">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transform transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="h-20 px-6 flex items-center justify-between gap-2.5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky to-bubblegum flex items-center justify-center text-lg shrink-0">
              🌈
            </div>
            <h1 className="font-display text-lg font-bold text-ink dark:text-gray-100">
              {t("appName")}
            </h1>
          </div>
          <button className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setSidebarOpen(false)}>
            <X size={18} className="text-gray-500 dark:text-gray-300" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems
            .filter((item) => canAccess(item.permission, role))
            .map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                    isActive
                      ? cn(item.bg, item.color)
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200"
                  )}
                >
                  <Icon size={18} className={isActive ? item.color : "text-gray-400 dark:text-gray-500"} />
                  {item.label}
                </Link>
              );
            })}
        </nav>

        <div className="p-3 space-y-1 border-t border-gray-100 dark:border-gray-800">
          <Link to="/profile" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200">
            <Settings size={18} className="text-gray-400 dark:text-gray-500" />
            {t("nav.settings")}
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40">
            <LogOut size={18} />
            {t("nav.logout")}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-4 sm:px-8 shrink-0">
          <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} className="text-gray-600 dark:text-gray-300" />
          </button>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-300">
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2.5 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full pl-3 pr-1 py-1 text-left border border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-none cursor-pointer"
              >
                <div className="hidden sm:block text-right leading-tight transition-none">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-100 transition-none">
                    {user?.name || t("profile.user")}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center justify-end gap-1 font-medium transition-none">
                    <span className="transition-none">
                      {t("role." + (role || "admin"))}
                      {isTeacher && user?.group ? ` • ${user.group}` : ""}
                    </span>
                    <ChevronDown size={12} className={cn("transition-transform duration-200", roleDropdownOpen && "rotate-180")} />
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky to-bubblegum flex items-center justify-center text-sm shrink-0 transition-none">
                  🙂
                </div>
              </button>

              {roleDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setRoleDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-150 transition-none">
                    {/* Foydalanuvchi ma'lumoti */}
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 transition-none">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-100 transition-none">
                        {user?.name || t("profile.user")}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 transition-none">
                        {t("role." + (role || "admin"))}
                        {isTeacher && user?.group ? ` • ${user.group}` : ""}
                      </p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setRoleDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-left text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <Settings size={14} className="text-gray-400" />
                        {t("nav.settings") || "Profil"}
                      </Link>

                      <button
                        onClick={() => {
                          setRoleDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                      >
                        <LogOut size={14} className="text-red-500" />
                        {t("nav.logout") || "Chiqish"}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-cream dark:bg-gray-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
}