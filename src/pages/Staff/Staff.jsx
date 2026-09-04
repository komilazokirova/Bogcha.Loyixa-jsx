import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus, Search, Phone, ChevronDown, MoreVertical, Pencil, Trash2,
  Users, UserCheck, UserX, Briefcase, UsersRound, FilterX,
} from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel,
} from "@/components/ui/alert-dialog";

import useStaffStore from "@/store/staffStore";
import { positionOptions, staffStatusOptions, staffStatusConfig, positionConfig } from "./mockStaff";
import { getStaffRequest, updateStaffStatusRequest, deleteStaffRequest } from "@/api/staffApi";
import { useTranslation } from "@/i18n/useTranslation";

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

function StaffCard({ member, t, onEdit, onDelete, onStatusChange }) {
  const pos = positionConfig[member.position] || {
    chip: "bg-slate-400/15 text-slate-600",
    avatar: "from-slate-400 to-slate-500",
  };
  const st = staffStatusConfig[member.status] || staffStatusConfig["faol"];
  const initials = `${member.firstName?.[0] || ""}${member.lastName?.[0] || ""}`.toUpperCase();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl ring-1 ring-foreground/10 shadow-sm p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${pos.avatar} flex items-center justify-center text-white font-display font-bold text-lg shrink-0`}>
            {initials}
          </div>
          <div className="min-w-0">
            <h3 className="font-display font-bold text-ink dark:text-gray-100 truncate">
              {member.firstName} {member.lastName}
            </h3>
            <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${pos.chip}`}>
              {t("positions." + member.position)}
            </span>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer">
              <MoreVertical size={16} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(member)}>
              <Pencil size={14} />
              {t("common.edit")}
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={() => onDelete(member)}>
              <Trash2 size={14} />
              {t("common.delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
        <span className="inline-flex items-center gap-1.5">
          <UsersRound size={14} />
          {member.group === "-" ? t("staff.noGroup") : member.group}
        </span>
        <a href={`tel:${member.phone}`} className="inline-flex items-center gap-1.5 transition-colors hover:text-sky">
          <Phone size={14} />
          {member.phone}
        </a>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <span className="text-xs text-gray-400 dark:text-gray-500">{t("staff.statusLabel")}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="inline-flex items-center gap-1.5 cursor-pointer">
              <span className={`w-2 h-2 rounded-full ${st.dot}`} />
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${st.chip}`}>{t("staffStatus." + member.status)}</span>
              <ChevronDown size={13} className="text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {staffStatusOptions.map((opt) => {
              const c = staffStatusConfig[opt];
              return (
                <DropdownMenuItem key={opt} onClick={() => onStatusChange(member, opt)}>
                  <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                  {t("staffStatus." + opt)}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default function Staff() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [position, setPosition] = useState("all");
  const [status, setStatus] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const staff = useStaffStore((s) => s.staff);
  const setStaff = useStaffStore((s) => s.setStaff);
  const updateStatus = useStaffStore((s) => s.updateStatus);
  const deleteStaff = useStaffStore((s) => s.deleteStaff);

  const { data } = useQuery({
    queryKey: ["staff"],
    queryFn: getStaffRequest,
    staleTime: 0,
  });

  useEffect(() => {
    if (Array.isArray(data)) setStaff(data);
  }, [data, setStaff]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return staff.filter((s) => {
      const name = `${s.firstName} ${s.lastName}`.toLowerCase();
      const matchSearch = !q || name.includes(q) || (s.phone || "").includes(q);
      const matchPosition = position === "all" || s.position === position;
      const matchStatus = status === "all" || s.status === status;
      return matchSearch && matchPosition && matchStatus;
    });
  }, [staff, search, position, status]);

  const stats = useMemo(() => {
    return {
      total: staff.length,
      active: staff.filter((s) => s.status === "faol").length,
      onLeave: staff.filter((s) => s.status === "ta'tilda").length,
      positions: new Set(staff.map((s) => s.position)).size,
    };
  }, [staff]);

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateStaffStatusRequest(id, status),
    onMutate: ({ id, status }) => {
      const prev = staff.find((s) => String(s.id) === String(id))?.status;
      updateStatus(id, status);
      return { id, prev };
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["staff"], (old) =>
        (old || []).map((s) => (String(s.id) === String(updated?.id) ? updated : s))
      );
    },
    onError: (_err, { id }, ctx) => {
      if (ctx?.prev) updateStatus(id, ctx.prev);
      toast.error(t("staff.statusChangeError"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteStaffRequest(id),
    onSuccess: (_data, id) => {
      deleteStaff(id);
      queryClient.setQueryData(["staff"], (old) =>
        (old || []).filter((s) => String(s.id) !== String(id))
      );
      setDeleteTarget(null);
      toast.success(t("staff.deletedToast"));
    },
    onError: () => toast.error(t("staff.deleteError")),
  });

  const hasActiveFilters = search.trim() !== "" || position !== "all" || status !== "all";

  const resetFilters = () => {
    setSearch("");
    setPosition("all");
    setStatus("all");
  };

  const handleStatusChange = (member, newStatus) => {
    if (member.status !== newStatus) {
      statusMutation.mutate({ id: member.id, status: newStatus });
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget != null) deleteMutation.mutate(deleteTarget.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink dark:text-gray-100">{t("staff.title")}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{t("staff.subtitle")}</p>
        </div>
        <Button
          onClick={() => navigate("/staff/new")}
          className="bg-gradient-to-r from-sky to-bubblegum text-white border-0 shadow-md shadow-sky/20 hover:opacity-90"
        >
          <Plus size={16} className="mr-2" />
          {t("staff.addNew")}
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={Users} label={t("staff.totalStaff")} value={stats.total} color="bg-sky/15 text-sky" />
        <StatCard icon={UserCheck} label={t("staff.active")} value={stats.active} color="bg-grass/15 text-emerald-600" />
        <StatCard icon={UserX} label={t("staff.onLeave")} value={stats.onLeave} color="bg-sun/15 text-amber-600" />
        <StatCard icon={Briefcase} label={t("staff.positions")} value={stats.positions} color="bg-bubblegum/15 text-bubblegum" />
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("staff.searchPlaceholder")}
            className="pl-9 bg-white dark:bg-gray-900"
          />
        </div>
        <div className="flex gap-2">
          <Select value={position} onValueChange={setPosition}>
            <SelectTrigger className="w-[170px] bg-white dark:bg-gray-900">
              <SelectValue placeholder={t("staffForm.position")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("staff.allPositions")}</SelectItem>
              {positionOptions.map((p) => (
                <SelectItem key={p} value={p}>{t("positions." + p)}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[160px] bg-white dark:bg-gray-900">
              <SelectValue placeholder={t("staff.statusLabel")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("staff.allStatuses")}</SelectItem>
              {staffStatusOptions.map((st) => (
                <SelectItem key={st} value={st}>{t("staffStatus." + st)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
          <div className="w-16 h-16 rounded-2xl bg-cream dark:bg-gray-800 flex items-center justify-center mb-4">
            <Search size={28} className="text-gray-400" />
          </div>
          <h3 className="font-display text-lg font-bold text-ink dark:text-gray-100">{t("staff.notFound")}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t("staff.notFoundHint")}</p>
          {hasActiveFilters && (
            <Button variant="outline" className="mt-4" onClick={resetFilters}>
              <FilterX size={16} className="mr-2" />
              {t("staff.clearFilters")}
            </Button>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((member) => (
            <StaffCard
              key={member.id}
              member={member}
              t={t}
              onEdit={(m) => navigate(`/staff/${m.id}/edit`)}
              onDelete={(m) => setDeleteTarget(m)}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("staff.deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget ? `${deleteTarget.firstName} ${deleteTarget.lastName}` : ""} {t("staff.deleteDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction variant="destructive" onClick={handleDeleteConfirm}>
              {t("common.delete")}
            </AlertDialogAction>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}