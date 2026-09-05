import { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  Wallet,
  Clock3,
  AlertTriangle,
  TrendingUp,
  CircleCheck,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import StatCard from "@/pages/Dashboard/StatCard";
import { groupTypeColors } from "@/pages/Groups/mockGroups";
import usePaymentsStore from "@/store/paymentsStore";
import { paymentStatusOptions } from "./mockPayments";
import { calculatePaymentStats } from "./paymentsUtils";
import { useTranslation } from "@/i18n/useTranslation";

// Holat bo'yicha vizual uslub (rang, ikonka) — faqat shu sahifaga tegishli
const statusStyles = {
  "to'langan": {
    dot: "bg-grass",
    pill: "bg-grass/15 text-emerald-700 border-grass/30",
    icon: CircleCheck,
  },
  kutilmoqda: {
    dot: "bg-sun",
    pill: "bg-sun/15 text-amber-600 border-sun/30",
    icon: Clock3,
  },
  "muddati o'tgan": {
    dot: "bg-bubblegum",
    pill: "bg-bubblegum/15 text-bubblegum border-bubblegum/30",
    icon: AlertTriangle,
  },
};

const initialsOf = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

export default function Payments() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Barchasi");

  const payments = usePaymentsStore((state) => state.payments);
  const updateStatus = usePaymentsStore((state) => state.updateStatus);

  const filteredPayments = payments.filter((p) => {
    const matchesSearch = p.childName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === "Barchasi" || p.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const { totalCollected, totalPending } = useMemo(
    () => calculatePaymentStats(payments),
    [payments]
  );

  const { overdueCount, paymentRate } = useMemo(() => {
    const overdue = payments.filter((p) => p.status === "muddati o'tgan").length;
    const paid = payments.filter((p) => p.status === "to'langan").length;
    const rate = payments.length ? Math.round((paid / payments.length) * 100) : 0;
    return { overdueCount: overdue, paymentRate: rate };
  }, [payments]);

  const formatSum = (num) =>
    `${num.toLocaleString("uz-UZ")} ${t("payments.currency")}`;

  // Dropdown uchun "Barchasi"siz status ro'yxati
  const statusChoices = paymentStatusOptions.filter((s) => s !== "Barchasi");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-bold text-ink dark:text-gray-100">
          💳 {t("payments.title")}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {t("payments.totalCount", { count: filteredPayments.length })}
        </p>
      </div>

      {/* Statistika kartalari */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t("payments.collected")}
          value={formatSum(totalCollected)}
          icon={Wallet}
          color="emerald"
        />
        <StatCard
          title={t("payments.pendingDebt")}
          value={formatSum(totalPending)}
          icon={Clock3}
          color="amber"
        />
        <StatCard
          title={t("payments.overdueCount")}
          value={overdueCount}
          icon={AlertTriangle}
          color="red"
        />
        <StatCard
          title={t("payments.paymentRate")}
          value={`${paymentRate}%`}
          icon={TrendingUp}
          color="blue"
        />
      </div>

      {/* Filtr va qidiruv */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <Input
            placeholder={t("payments.searchPlaceholder")}
            className="pl-9 rounded-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full sm:w-48 rounded-full">
            <SelectValue placeholder={t("payments.status")} />
          </SelectTrigger>
          <SelectContent>
            {paymentStatusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {status === "Barchasi" ? t("common.all") : t("paymentStatus." + status)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Jadval */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-cream/60 dark:bg-gray-800/60 hover:bg-cream/60 dark:hover:bg-gray-800/60">
              <TableHead>{t("payments.child")}</TableHead>
              <TableHead>{t("payments.group")}</TableHead>
              <TableHead>{t("payments.month")}</TableHead>
              <TableHead>{t("payments.amount")}</TableHead>
              <TableHead>{t("payments.date")}</TableHead>
              <TableHead>{t("payments.status")}</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredPayments.length > 0 ? (
              filteredPayments.map((p) => {
                const style = statusStyles[p.status] ?? statusStyles["kutilmoqda"];
                const StatusIcon = style.icon;
                return (
                  <TableRow
                    key={p.id}
                    className="hover:bg-cream/50 dark:hover:bg-gray-800/50"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 shrink-0 rounded-full bg-sky/15 text-sky flex items-center justify-center text-xs font-semibold">
                          {initialsOf(p.childName)}
                        </div>
                        <span className="text-ink dark:text-gray-100">{p.childName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          groupTypeColors[p.group] || ""
                        }`}
                      >
                        {p.group}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">
                      {p.month}
                    </TableCell>
                    <TableCell className="font-semibold text-ink dark:text-gray-100">
                      {formatSum(p.amount)}
                    </TableCell>
                    <TableCell className="text-gray-500 dark:text-gray-400">
                      {p.date}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className={`inline-flex items-center gap-1.5 cursor-pointer rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors hover:brightness-95 ${style.pill}`}
                          >
                            <StatusIcon size={12} />
                            {t("paymentStatus." + p.status) || p.status}
                            <ChevronDown size={14} className="opacity-60" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          {statusChoices.map((option) => {
                            const optionStyle = statusStyles[option];
                            const OptionIcon = optionStyle?.icon;
                            return (
                              <DropdownMenuItem
                                key={option}
                                onClick={() => updateStatus(p.id, option)}
                                className="gap-2"
                              >
                                {OptionIcon && (
                                  <OptionIcon size={14} className="text-gray-400" />
                                )}
                                {t("paymentStatus." + option) || option}
                              </DropdownMenuItem>
                            );
                          })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                  {t("payments.notFound")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}