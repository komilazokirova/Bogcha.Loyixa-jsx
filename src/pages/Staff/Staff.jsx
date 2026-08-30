import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Phone, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import useStaffStore from "@/store/staffStore";
import { positionOptions, staffStatusOptions, staffStatusColors } from "./mockStaff";

export default function Staff() {
    const [search, setSearch] = useState("");
    const [selectedPosition, setSelectedPosition] = useState("Barchasi");
    const staff = useStaffStore((state) => state.staff);
    const updateStatus = useStaffStore((state) => state.updateStatus);

    const filteredStaff = staff.filter((s) => {
        const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
        const matchesSearch = fullName.includes(search.toLowerCase());
        const matchesPosition =
            selectedPosition === "Barchasi" || s.position === selectedPosition;
        return matchesSearch && matchesPosition;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Xodimlar ro'yxati</h1>
                    <p className="text-gray-500 text-sm">
                        Jami: {filteredStaff.length} ta xodim
                    </p>
                </div>
                <Link to="/staff/new">
                    <Button>
                        <Plus size={16} className="mr-2" />
                        Yangi xodim qo'shish
                    </Button>
                </Link>
            </div>

            {/* Filtr va qidiruv */}
            <div className="flex gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <Input
                        placeholder="Ism bo'yicha qidirish..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select
                    value={selectedPosition}
                    onChange={(e) => setSelectedPosition(e.target.value)}
                    className="border border-gray-200 dark:border-gray-700 rounded-md px-3 text-sm bg-white dark:bg-gray-900 text-ink dark:text-gray-100"
                >
                    {positionOptions.map((position) => (
                        <option key={position} value={position}>
                            {position}
                        </option>
                    ))}
                </select>
            </div>

            {/* Jadval */}
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Ism Familiya</TableHead>
                            <TableHead>Lavozim</TableHead>
                            <TableHead>Guruh</TableHead>
                            <TableHead>Telefon</TableHead>
                            <TableHead>Holat</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredStaff.map((s) => (
                            <TableRow key={s.id}>
                                <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                                    {s.firstName} {s.lastName}
                                </TableCell>
                                <TableCell>{s.position}</TableCell>
                                <TableCell>{s.group}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1.5 text-gray-600">
                                        <Phone size={14} />
                                        {s.phone}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="inline-flex items-center gap-1 cursor-pointer">
                                                <Badge variant={staffStatusColors[s.status]}>
                                                    {s.status}
                                                </Badge>
                                                <ChevronDown size={14} className="text-gray-400" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start">
                                            {staffStatusOptions.map((option) => (
                                                <DropdownMenuItem
                                                    key={option}
                                                    onClick={() => updateStatus(s.id, option)}
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