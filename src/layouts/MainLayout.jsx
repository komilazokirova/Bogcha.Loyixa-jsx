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
} from "lucide-react";
import useAuthStore from "../store/authStore";
import { cn } from "../lib/utils";

import headerBolaBg from "../assets/HeaderBola.jpg";

const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard, color: "text-sky", bg: "bg-sky/10" },
    { label: "Bolalar", path: "/children", icon: Users, color: "text-bubblegum", bg: "bg-bubblegum/10" },
    { label: "Guruhlar", path: "/groups", icon: UsersRound, color: "text-grass", bg: "bg-grass/10" },
    { label: "To'lovlar", path: "/payments", icon: Wallet, color: "text-amber-500", bg: "bg-sun/10" },
    { label: "Xodimlar", path: "/staff", icon: Contact, color: "text-sky", bg: "bg-sky/10" },
    { label: "Davomat", path: "/attendance", icon: CalendarCheck, color: "text-bubblegum", bg: "bg-bubblegum/10" },
];

export default function MainLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const logout = useAuthStore((state) => state.logout);
    const user = useAuthStore((state) => state.user);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="flex h-screen bg-cream">
            {/* Sidebar */}
            <aside className="w-64 flex flex-col bg-white border-r border-gray-100">
                <div className="h-20 px-6 flex items-center gap-2.5 border-b border-gray-100">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky to-bubblegum flex items-center justify-center text-lg shrink-0">
                        🌈
                    </div>
                    <h1 className="font-display text-lg font-bold text-ink">
                        Bog'cha CRM
                    </h1>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                                    isActive
                                        ? cn(item.bg, item.color)
                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                )}
                            >
                                <Icon size={18} className={isActive ? item.color : "text-gray-400"} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-3 space-y-1 border-t border-gray-100">
                    <Link
                        to="/profile"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                    >
                        <Settings size={18} className="text-gray-400" />
                        Sozlamalar
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50"
                    >
                        <LogOut size={18} />
                        Chiqish
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-end mb-5 px-8 shrink-0">
                    <div className="flex items-center gap-2.5 bg-gray-50 rounded-full pl-3 pr-1 py-1">
                        <span className="text-sm font-semibold text-gray-600">
                            {user?.name || "Foydalanuvchi"}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky to-bubblegum flex items-center justify-center text-sm">
                            🙂
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 bg-cream">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}