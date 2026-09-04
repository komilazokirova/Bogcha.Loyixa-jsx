import { useState, useMemo } from "react";
import {
  Search, Check, X, Users, UserCheck, UserX, UserMinus,
  CheckCheck, Eraser, UsersRound, CalendarDays, FilterX,
} from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n/useTranslation";
import { isManagement } from "@/lib/roles";

import useAuthStore from "@/store/authStore";
import useChildrenStore from "@/store/childrenStore";
import useGroupsStore from "@/store/groupsStore";
import useAttendanceStore from "@/store/attendanceStore";

const todayStr = () => new Date().toISOString().slice(0, 10);

const groupColorMap = {
  Yasli: "bg-bubblegum/15 text-bubblegum",
  Kichik: "bg-sun/15 text-amber-600",
  "O'rta": "bg-grass/15 text-emerald-700",
  Katta: "bg-sky/15 text-sky",
};

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl ring-1 ring-foreground/10 shadow-sm p-4 flex items-center gap-3">
      <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center shrink-0`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="font-display text-2xl font-bold text-ink dark:text-gray-100 leading-none">{value}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{label}</p>
      </div>
    </div>
  );
}

function ChildCard({ child, groupName, status, t, onSetStatus, onClear }) {
  const firstName = child.firstName || "";
  const lastName = child.lastName || "";
  const initials = `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();
  const groupColor = groupColorMap[groupName] || "bg-slate-400/15 text-slate-600";

  const statusCfg = {
    keldi: { label: t("attendanceStatus.keldi"), chip: "bg-grass/15 text-emerald-700", dot: "bg-grass" },
    kelmadi: { label: t("attendanceStatus.kelmadi"), chip: "bg-red-500/15 text-red-600", dot: "bg-red-500" },
    belgilanmagan: { label: t("attendanceStatus.belgilanmagan"), chip: "bg-slate-400/15 text-slate-600", dot: "bg-slate-400" },
  };
  const st = statusCfg[status] || statusCfg["belgilanmagan"];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl ring-1 ring-foreground/10 shadow-sm p-5">
      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 rounded-2xl ${groupColor} flex items-center justify-center font-display font-bold text-lg shrink-0`}>
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display font-bold text-ink dark:text-gray-100 truncate">
            {firstName} {lastName}
          </h3>
          <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${groupColor}`}>
            {groupName || t("attendance.noGroup")}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full ${st.chip}`}>
          <span className={`w-2 h-2 rounded-full ${st.dot}`} />
          {st.label}
        </span>
        {status !== "belgilanmagan" && (
          <button onClick={onClear} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 inline-flex items-center gap-1 cursor-pointer">
            <Eraser size={13} />
            {t("attendance.clear")}
          </button>
        )}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button
          variant={status === "keldi" ? "default" : "outline"}
          size="sm"
          onClick={onSetStatus("keldi")}
          className={status === "keldi" ? "bg-grass hover:bg-grass/80 text-white border-0" : ""}
        >
          <Check size={14} className="mr-1" />
          {t("attendanceStatus.keldi")}
        </Button>
        <Button
          variant={status === "kelmadi" ? "destructive" : "outline"}
          size="sm"
          onClick={onSetStatus("kelmadi")}
        >
          <X size={14} className="mr-1" />
          {t("attendanceStatus.kelmadi")}
        </Button>
      </div>
    </div>
  );
}

export default function Attendance() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(todayStr());

  const user = useAuthStore((state) => state.user);
  const children = useChildrenStore((state) => state.children);
  const groups = useGroupsStore((state) => state.groups);
  const getStatus = useAttendanceStore((state) => state.getStatus);
  const setStatus = useAttendanceStore((state) => state.setStatus);
  useAttendanceStore((state) => state.records);

  const role = user?.role || "admin";
  const management = isManagement(role);

  const teacherOwnGroup = !management ? user?.group : null;
  const [selectedGroup, setSelectedGroup] = useState(
    teacherOwnGroup || groups[0]?.name || ""
  );
  const activeGroup = teacherOwnGroup || selectedGroup;

  // id -> nom xaritasi (bolaning groupId sini nomga aylantiradi)
  const groupNameById = useMemo(() => {
    const map = {};
    groups.forEach((g) => { map[g.id] = g.name; });
    return map;
  }, [groups]);

  const childGroupName = (child) =>
    groupNameById[child?.groupId] || child?.group || "";

  const groupChildren = useMemo(() => {
    return children.filter((child) => {
      const matchesGroup = childGroupName(child) === activeGroup;
      const fullName = `${child.firstName || ""} ${child.lastName || ""}`.toLowerCase();
      const matchesSearch = fullName.includes(search.toLowerCase());
      return matchesGroup && matchesSearch;
    });
  }, [children, activeGroup, search, groupNameById]);

  const presentCount = groupChildren.filter((c) => getStatus(c.id, selectedDate) === "keldi").length;
  const absentCount = groupChildren.filter((c) => getStatus(c.id, selectedDate) === "kelmadi").length;
  const pendingCount = groupChildren.length - presentCount - absentCount;
  const attendanceRate = groupChildren.length
    ? Math.round((presentCount / groupChildren.length) * 100)
    : 0;

  const markAllPresent = () => {
    if (!groupChildren.length) return;
    groupChildren.forEach((c) => setStatus(c.id, selectedDate, "keldi"));
    toast.success(t("attendance.markedAll"));
  };

  const clearAll = () => {
    if (!groupChildren.length) return;
    const changed = groupChildren.filter(
      (c) => getStatus(c.id, selectedDate) !== "belgilanmagan"
    ).length;
    if (changed === 0) {
      toast.info(t("attendance.alreadyCleared"));
      return;
    }
    groupChildren.forEach((c) => setStatus(c.id, selectedDate, "belgilanmagan"));
    toast.success(t("attendance.cleared"));
  };

  const hasActiveSearch = search.trim() !== "";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink dark:text-gray-100">{t("attendance.title")}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {activeGroup || t("attendance.noGroup")} • {selectedDate}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-gray-400" />
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-auto bg-white dark:bg-gray-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={Users} label={t("attendance.totalChildren")} value={groupChildren.length} color="bg-sky/15 text-sky" />
        <StatCard icon={UserCheck} label={t("attendanceStatus.keldi")} value={presentCount} color="bg-grass/15 text-emerald-600" />
        <StatCard icon={UserX} label={t("attendanceStatus.kelmadi")} value={absentCount} color="bg-red-500/15 text-red-600" />
        <StatCard icon={UserMinus} label={t("attendanceStatus.belgilanmagan")} value={pendingCount} color="bg-slate-400/15 text-slate-600" />
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl ring-1 ring-foreground/10 shadow-sm p-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-500 dark:text-gray-400 font-medium">{t("attendance.rateLabel")}</span>
          <span className="font-display font-bold text-ink dark:text-gray-100">{attendanceRate}%</span>
        </div>
        <div className="h-2.5 w-full bg-cream dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-grass to-sky transition-all duration-300"
            style={{ width: `${attendanceRate}%` }}
          />
        </div>
      </div>

      {management && (
        <div className="flex flex-wrap gap-2">
          {groups.map((g) => (
            <Button
              key={g.id}
              variant={selectedGroup === g.name ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedGroup(g.name)}
              className={selectedGroup === g.name ? "bg-gradient-to-r from-sky to-bubblegum text-white border-0" : ""}
            >
              {g.name}
            </Button>
          ))}
        </div>
      )}

      {!management && !teacherOwnGroup && (
        <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          {t("attendance.noGroupAssigned")}
        </p>
      )}

      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder={t("attendance.searchPlaceholder")}
            className="pl-9 bg-white dark:bg-gray-900"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={markAllPresent}>
            <CheckCheck size={15} className="mr-1.5 text-grass" />
            {t("attendance.markAll")}
          </Button>
          <Button variant="outline" size="sm" onClick={clearAll}>
            <Eraser size={15} className="mr-1.5 text-gray-400" />
            {t("attendance.clear")}
          </Button>
        </div>
      </div>

      {groupChildren.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
          <div className="w-16 h-16 rounded-2xl bg-cream dark:bg-gray-800 flex items-center justify-center mb-4">
            <UsersRound size={28} className="text-gray-400" />
          </div>
          <h3 className="font-display text-lg font-bold text-ink dark:text-gray-100">{t("attendance.notFound")}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {hasActiveSearch ? t("attendance.clearSearch") : t("attendance.emptyGroup")}
          </p>
          {hasActiveSearch && (
            <Button variant="outline" className="mt-4" onClick={() => setSearch("")}>
              <FilterX size={16} className="mr-2" />
              {t("attendance.clearSearch")}
            </Button>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {groupChildren.map((child) => {
            const status = getStatus(child.id, selectedDate);
            return (
              <ChildCard
                key={child.id}
                child={child}
                groupName={childGroupName(child)}
                status={status}
                t={t}
                onSetStatus={(s) => () => setStatus(child.id, selectedDate, s)}
                onClear={() => setStatus(child.id, selectedDate, "belgilanmagan")}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}