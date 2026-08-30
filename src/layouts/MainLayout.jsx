import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UsersRound,
  Wallet,
  Contact,
  CalendarCheck,
  Settings,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";
import useAuthStore from "../store/authStore";
import useThemeStore from "../store/themeStore";
import { cn } from "../lib/utils";
import { useState } from "react";

const roleLabels = {
  admin: "Admin",
  director: "Direktor",
  teacher: "Tarbiyachi",
};

const menuItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard, color: "text-sky", bg: "bg-sky/10", roles: ["admin", "director", "teacher"] },
  { label: "Bolalar", path: "/children", icon: Users, color: "text-bubblegum", bg: "bg-bubblegum/10", roles: ["admin", "director", "teacher"] },
  { label: "Guruhlar", path: "/groups", icon: UsersRound, color: "text-grass", bg: "bg-grass/10", roles: ["admin", "director"] },
  { label: "To'lovlar", path: "/payments", icon: Wallet, color: "text-amber-500", bg: "bg-sun/10", roles: ["admin", "director"] },
  { label: "Xodimlar", path: "/staff", icon: Contact, color: "text-sky", bg: "bg-sky/10", roles: ["admin", "director"] },
  { label: "Davomat", path: "/attendance", icon: CalendarCheck, color: "text-bubblegum", bg: "bg-bubblegum/10", roles: ["admin", "director", "teacher"] },
];

export default function MainLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-cream dark:bg-gray-950">
      {/* Mobil uchun qora overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transform transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-20 px-6 flex items-center justify-between gap-2.5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky to-bubblegum flex items-center justify-center text-lg shrink-0">
              🌈
            </div>
            <h1 className="font-display text-lg font-bold text-ink dark:text-gray-100">
              Bog'cha CRM
            </h1>
          </div>
          <button
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} className="text-gray-500 dark:text-gray-300" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems
            .filter((item) => item.roles.includes(user?.role))
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
                  <Icon
                    size={18}
                    className={isActive ? item.color : "text-gray-400 dark:text-gray-500"}
                  />
                  {item.label}
                </Link>
              );
            })}
        </nav>

        <div className="p-3 space-y-1 border-t border-gray-100 dark:border-gray-800">
          <Link
            to="/profile"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <Settings size={18} className="text-gray-400 dark:text-gray-500" />
            Sozlamalar
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
          >
            <LogOut size={18} />
            Chiqish
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-4 sm:px-8 shrink-0">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} className="text-gray-600 dark:text-gray-300" />
          </button>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-300"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="flex items-center gap-2.5 bg-gray-50 dark:bg-gray-800 rounded-full pl-3 pr-1 py-1">
              <div className="hidden sm:block text-right leading-tight">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-100">
                  {user?.name || "Foydalanuvchi"}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {roleLabels[user?.role] || ""}
                  {user?.group ? ` • ${user.group} guruh` : ""}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky to-bubblegum flex items-center justify-center text-sm shrink-0">
                🙂
              </div>
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