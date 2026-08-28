import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import useChildrenStore from "@/store/childrenStore";
import { groupOptions, groupColors } from "./mockChildren";
import { useNavigate } from "react-router-dom";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function Children() {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const [selectedGroup, setSelectedGroup] = useState("Barchasi");
    const children = useChildrenStore((state) => state.children);

    const filteredChildren = children.filter((child) => {
        const fullName = `${child.firstName} ${child.lastName}`.toLowerCase();
        const matchesSearch = fullName.includes(search.toLowerCase());
        const matchesGroup =
            selectedGroup === "Barchasi" || child.group === selectedGroup;
        return matchesSearch && matchesGroup;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Bolalar ro'yxati</h1>
                    <p className="text-gray-500 text-sm">
                        Jami: {filteredChildren.length} ta bola
                    </p>
                </div>
                <Link to="/children/new">
                    <Button>
                        <Plus size={16} className="mr-2" />
                        Yangi bola qo'shish
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
                <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                    <SelectTrigger className="w-40">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {groupOptions.map((group) => (
                            <SelectItem key={group} value={group}>
                                {group}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Jadval */}
            <div className="bg-white rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Rasm</TableHead>
                            <TableHead>Ism Familiya</TableHead>
                            <TableHead>Tug'ilgan sana</TableHead>
                            <TableHead>Guruh</TableHead>
                            <TableHead>To'lov holati</TableHead>
                            <TableHead className="text-right">Amallar</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredChildren.map((child) => (
                            <TableRow
                                key={child.id}
                                className="cursor-pointer hover:bg-gray-50"
                                onClick={() => navigate(`/children/${child.id}`)}
                            >
                                <TableCell>
                                    {child.photoUrl ? (
                                        <img
                                            src={child.photoUrl}
                                            alt={child.firstName}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                                            {child.firstName?.[0]}
                                            {child.lastName?.[0]}
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="font-medium">
                                    {child.firstName} {child.lastName}
                                </TableCell>
                                <TableCell>{child.birthDate}</TableCell>
                                <TableCell>
                                    <span
                                        className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${groupColors[child.group] || ""}`}
                                    >
                                        {child.group}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            child.paymentStatus === "to'langan"
                                                ? "default"
                                                : "destructive"
                                        }
                                    >
                                        {child.paymentStatus}
                                    </Badge>
                                </TableCell>
                                <TableCell
                                    className="text-right space-x-2"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Button variant="ghost" size="icon">
                                        <Pencil size={16} />
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                        <Trash2 size={16} className="text-red-500" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}