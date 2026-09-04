import { Users, UsersRound, Wallet, AlertCircle } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import StatCard from "./StatCard";
import headerBolaBg from "@/assets/HeaderBola.png";
import useAuthStore from "@/store/authStore";
import useChildrenStore from "@/store/childrenStore";
import useGroupsStore from "@/store/groupsStore";
import { useTranslation } from "@/i18n/useTranslation";

// TODO: Backend tayyor bo'lgach, bu mock ma'lumotlar API'dan olinadi
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

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const allChildren = useChildrenStore((state) => state.children);
  const groups = useGroupsStore((state) => state.groups);
  const { t } = useTranslation();

  const role = user?.role || "admin";
  const isTeacher = role === "teacher";

  // TUZATILDI: Tarbiyachining guruhini nom bo'yicha topib, shu guruh ID'siga
  // mos bolalarni olamiz (avval child.group bilan solishtirilib, doim 0 chiqardi).
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
            <CardTitle className="text-base">{t("dashboard.chartTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="tolov"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}