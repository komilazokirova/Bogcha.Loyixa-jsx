import { useState, useMemo } from "react";
import { Search, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import useAuthStore from "@/store/authStore";
import useChildrenStore from "@/store/childrenStore";
import useGroupsStore from "@/store/groupsStore";
import useAttendanceStore from "@/store/attendanceStore";
import { attendanceStatusColors } from "./mockAttendance";

const todayStr = () => new Date().toISOString().slice(0, 10);

// Kim "boshqaruvchi" (barcha guruhlarni ko'ra oladigan) hisoblanishini shu yerda belgilaymiz
const MANAGEMENT_ROLES = ["admin", "director"];

export default function Attendance() {
    const [search, setSearch] = useState("");
    const [selectedDate, setSelectedDate] = useState(todayStr());

    const user = useAuthStore((state) => state.user);
    const children = useChildrenStore((state) => state.children);
    const groups = useGroupsStore((state) => state.groups);
    const getStatus = useAttendanceStore((state) => state.getStatus);
    const setStatus = useAttendanceStore((state) => state.setStatus);
    useAttendanceStore((state) => state.records); // re-render uchun obuna

    const role = user?.role || "admin"; // fallback: hozircha mock login har doim admin
    const isManagement = MANAGEMENT_ROLES.includes(role);

    // Tarbiyachi bo'lsa — faqat o'z guruhi. Admin/direktor bo'lsa — tanlash imkoniyati.
    const teacherOwnGroup = !isManagement ? user?.group : null;

    const [selectedGroup, setSelectedGroup] = useState(
        teacherOwnGroup || groups[0]?.name || ""
    );

    const activeGroup = teacherOwnGroup || selectedGroup;

    const groupChildren = useMemo(() => {
        return children.filter((child) => {
            const matchesGroup = child.group === activeGroup;
            const fullName = `${child.firstName} ${child.lastName}`.toLowerCase();
            const matchesSearch = fullName.includes(search.toLowerCase());
            return matchesGroup && matchesSearch;
        });
    }, [children, activeGroup, search]);

    const presentCount = groupChildren.filter(
        (c) => getStatus(c.id, selectedDate) === "keldi"
    ).length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold">Davomat</h1>
                    <p className="text-gray-500 text-sm">
                        {activeGroup || "Guruh tanlanmagan"} — {selectedDate} — Keldi:{" "}
                        {presentCount} / {groupChildren.length}
                    </p>
                </div>
                <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-auto"
                />
            </div>

            {/* Guruh tanlash — faqat admin/direktor uchun ko'rinadi */}
            {isManagement && (
                <div className="flex flex-wrap gap-2">
                    {groups.map((g) => (
                        <Button
                            key={g.id}
                            variant={selectedGroup === g.name ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedGroup(g.name)}
                        >
                            {g.name}
                        </Button>
                    ))}
                </div>
            )}

            {/* Agar tarbiyachi bo'lsa va guruhi hali belgilanmagan bo'lsa */}
            {!isManagement && !teacherOwnGroup && (
                <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-md px-4 py-3">
                    Sizning profilingizga hali guruh biriktirilmagan. Administrator bilan bog'laning.
                </p>
            )}

            {/* Qidiruv */}
            <div className="relative max-w-sm">
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

            {/* Jadval */}
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Ism Familiya</TableHead>
                            <TableHead>Holat</TableHead>
                            <TableHead className="text-right">Amallar</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {groupChildren.map((child) => {
                            const status = getStatus(child.id, selectedDate);
                            return (
                                <TableRow key={child.id}>
                                    <TableCell className="font-medium">
                                        {child.firstName} {child.lastName}
                                    </TableCell>
                                    <TableCell>
                                        {status === "belgilanmagan" ? (
                                            <Badge variant="secondary">belgilanmagan</Badge>
                                        ) : (
                                            <Badge variant={attendanceStatusColors[status]}>
                                                {status}
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button
                                            variant={status === "keldi" ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setStatus(child.id, selectedDate, "keldi")}
                                        >
                                            <Check size={14} className="mr-1" />
                                            Keldi
                                        </Button>
                                        <Button
                                            variant={status === "kelmadi" ? "destructive" : "outline"}
                                            size="sm"
                                            onClick={() => setStatus(child.id, selectedDate, "kelmadi")}
                                        >
                                            <X size={14} className="mr-1" />
                                            Kelmadi
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}