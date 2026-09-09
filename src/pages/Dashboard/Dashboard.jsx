import { Users, UsersRound, Wallet, AlertCircle } from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
    ChartContainer, 
    ChartTooltip, 
    ChartTooltipContent 
} from "@/components/ui/chart";
import StatCard from "./StatCard";
import headerBolaBg from "@/assets/HeaderBola.png";
import useAuthStore from "@/store/authStore";
import useChildrenStore from "@/store/childrenStore";
import useGroupsStore from "@/store/groupsStore";
import { useTranslation } from "@/i18n/useTranslation";

// Mock ma'lumotlar
const mockStats = {
    totalChildren: 100,
    totalGroups: 4,
    paymentRate: 82,
    debtors: 18,
};

const mockChartData = [
    { month: "Mart", tolov: 68 },
    { month: "Aprel", tolov: 74 },
    { month: "May", tolov: 71 },
    { month: "Iyun", tolov: 80 },
    { month: "Iyul", tolov: 76 },
    { month: "Avgust", tolov: 82 },
];

// Shadcn Chart uchun konfiguratsiya
const chartConfig = {
    tolov: {
        label: "To'lov",
        color: "#4FB6E8",
    },
};

export default function Dashboard() {
    const user = useAuthStore((state) => state.user);
    const allChildren = useChildrenStore((state) => state.children);
    const groups = useGroupsStore((state) => state.groups);
    const { t } = useTranslation();

    const role = user?.role || "admin";
    const isTeacher = role === "teacher";

    const teacherGroup = groups.find((g) => g.name === user?.group);
    const visibleChildren = isTeacher
        ? allChildren.filter((c) => String(c.groupId) === String(teacherGroup?.id))
        : allChildren;

    const stats = isTeacher
        ? {
            totalChildren: visibleChildren.length,
            totalGroups: 1,
            paymentRate: visibleChildren.length
                ? Math.round(
                    (visibleChildren.filter((c) => c.paymentStatus === "to'langan").length /
                        visibleChildren.length) *
                    100
                )
                : 0,
            debtors: visibleChildren.filter((c) => c.paymentStatus === "qarzdor").length,
        }
        : mockStats;

    const chartData = mockChartData.map((item) => ({
        month: t("months." + item.month),
        tolov: item.tolov,
    }));

    return (
        <div className="space-y-6">
            {/* Xush kelibsiz banneri */}
            <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-gray-900 h-48 shadow-sm">
                <img
                    src={headerBolaBg}
                    alt=""
                    className="hidden lg:block absolute right-20 top-0 h-full w-auto object-cover"
                />
                <div className="relative z-10 h-full flex flex-col justify-center px-5 lg:px-8 max-w-[70%] lg:max-w-md">
                    <span className="text-gray-400 dark:text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1">
                        🌈 {t("appName")}
                    </span>
                    <h2 className="font-display text-lg lg:text-2xl font-bold text-ink dark:text-gray-100 mb-1">
                        {t("dashboard.welcome")}
                        {user?.name ? `, ${user.name}` : ""}!
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-xs lg:text-sm">
                        {t("dashboard.welcomeSubtitle")} 🌟
                    </p>
                </div>
            </div>

            <div>
                <h1 className="text-2xl font-bold">{t("dashboard.title")}</h1>
                <p className="text-gray-500 text-sm">
                    {isTeacher
                        ? t("dashboard.groupStats", { group: user.group })
                        : t("dashboard.generalStats")}
                </p>
            </div>

            {/* Statistika kartalari */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title={isTeacher ? t("dashboard.myChildren") : t("dashboard.totalChildren")}
                    value={stats.totalChildren}
                    icon={Users}
                    color="blue"
                />
                <StatCard
                    title={isTeacher ? t("dashboard.myGroup") : t("dashboard.groupCount")}
                    value={isTeacher ? user.group : stats.totalGroups}
                    icon={UsersRound}
                    color="emerald"
                />
                <StatCard
                    title={t("dashboard.paymentRate")}
                    value={`${stats.paymentRate}%`}
                    icon={Wallet}
                    color="amber"
                />
                <StatCard
                    title={t("dashboard.debtors")}
                    value={stats.debtors}
                    icon={AlertCircle}
                    color="red"
                />
            </div>

            {/* Grafik - faqat Admin/Direktor uchun */}
            {!isTeacher && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base">
                                    Oylik to'lov dinamikasi
                                </CardTitle>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                    So'nggi 6 oy bo'yicha to'lov foizi
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-sky">
                                    {mockChartData[mockChartData.length - 1].tolov}%
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500">
                                    joriy oy
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Shadcn ChartContainer ishlashni boshlaydi */}
                        <ChartContainer config={chartConfig} className="h-[260px] w-full">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="paymentGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#4FB6E8" stopOpacity={0.35} />
                                        <stop offset="100%" stopColor="#4FB6E8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="currentColor"
                                    className="text-gray-100 dark:text-gray-800"
                                />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tick={{ fontSize: 12, fill: "#9CA3AF" }}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    domain={[0, 100]}
                                    tick={{ fontSize: 12, fill: "#9CA3AF" }}
                                />
                                {/* Shadcn chiroyli Tooltipi */}
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent indicator="dot" />}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="tolov"
                                    stroke="var(--color-tolov)"
                                    fill="url(#paymentGradient)"
                                    strokeWidth={2.5}
                                    dot={{ r: 3, fill: "var(--color-tolov)", strokeWidth: 0 }}
                                    activeDot={{ r: 5 }}
                                />
                            </AreaChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}