import { useState, useMemo } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import usePaymentsStore from "@/store/paymentsStore";
import { paymentStatusOptions, paymentStatusColors } from "./mockPayments";
import { calculatePaymentStats } from "./paymentsUtils";

export default function Payments() {
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

    const formatSum = (num) => `${num.toLocaleString("uz-UZ")} so'm`;

    // Dropdown uchun "Barchasi"siz status ro'yxati
    const statusChoices = paymentStatusOptions.filter((s) => s !== "Barchasi");

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">To'lovlar</h1>
                <p className="text-gray-500 text-sm">
                    Jami: {filteredPayments.length} ta yozuv
                </p>
            </div>

            {/* Statistika kartalari */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-sm text-gray-500">Yig'ilgan summa</p>
                        <p className="text-xl font-semibold text-emerald-600">
                            {formatSum(totalCollected)}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-sm text-gray-500">Kutilayotgan / qarzdorlik</p>
                        <p className="text-xl font-semibold text-red-500">
                            {formatSum(totalPending)}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Filtr va qidiruv */}
            <div className="flex gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <Input
                        placeholder="Bola ismi bo'yicha qidirish..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="border border-gray-200 dark:border-gray-700 rounded-md px-3 text-sm bg-white dark:bg-gray-900 text-ink dark:text-gray-100"
                >
                    {paymentStatusOptions.map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
            </div>

            {/* Jadval */}
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Bola</TableHead>
                            <TableHead>Guruh</TableHead>
                            <TableHead>Oy</TableHead>
                            <TableHead>Summa</TableHead>
                            <TableHead>Sana</TableHead>
                            <TableHead>Holat</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPayments.map((p) => (
                            <TableRow key={p.id}>
                                <TableCell className="font-medium">{p.childName}</TableCell>
                                <TableCell>{p.group}</TableCell>
                                <TableCell>{p.month}</TableCell>
                                <TableCell>{formatSum(p.amount)}</TableCell>
                                <TableCell>{p.date}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="inline-flex items-center gap-1 cursor-pointer">
                                                <Badge variant={paymentStatusColors[p.status]}>
                                                    {p.status}
                                                </Badge>
                                                <ChevronDown size={14} className="text-gray-400" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start">
                                            {statusChoices.map((option) => (
                                                <DropdownMenuItem
                                                    key={option}
                                                    onClick={() => updateStatus(p.id, option)}
                                                >
                                                    {option}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}