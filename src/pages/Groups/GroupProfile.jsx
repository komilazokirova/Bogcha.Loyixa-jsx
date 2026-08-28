import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardHeader,
    CardTitle,
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

import useGroupsStore from "@/store/groupsStore";
import useChildrenStore from "@/store/childrenStore";
import { groupTypeColors } from "./mockGroups";

export default function GroupProfile() {
    const { id } = useParams();
    const navigate = useNavigate();

    const groups = useGroupsStore((state) => state.groups);
    const children = useChildrenStore((state) => state.children);

    const group = groups.find((g) => String(g.id) === id);
    const groupChildren = group
        ? children.filter((child) => child.group === group.name)
        : [];

    if (!group) {
        return (
            <div className="space-y-4">
                <p className="text-gray-500">Guruh topilmadi.</p>
                <Link to="/groups">
                    <Button variant="outline">
                        <ArrowLeft size={16} className="mr-2" />
                        Guruhlarga qaytish
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Button variant="ghost" onClick={() => navigate("/groups")}>
                <ArrowLeft size={16} className="mr-2" />
                Guruhlarga qaytish
            </Button>

            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold">{group.name} guruhi</h1>
                        <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${groupTypeColors[group.name] || ""}`}
                        >
                            {group.ageRange}
                        </span>
                    </div>
                    <p className="text-gray-500 text-sm">
                        Tarbiyachi: {group.teacher}
                    </p>
                </div>
            </div>

            {/* Statistika kartalari */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                    <CardContent className="flex items-center gap-3 pt-6">
                        <div className="w-10 h-10 rounded-full bg-sky/15 flex items-center justify-center">
                            <Users size={18} className="text-sky" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Bolalar soni</p>
                            <p className="text-lg font-semibold">
                                {groupChildren.length} / {group.capacity}
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center gap-3 pt-6">
                        <div className="w-10 h-10 rounded-full bg-grass/15 flex items-center justify-center">
                            <UserRound size={18} className="text-emerald-700" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Tarbiyachi</p>
                            <p className="text-lg font-semibold">{group.teacher}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Guruhdagi bolalar */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Guruhdagi bolalar</CardTitle>
                </CardHeader>
                <CardContent>
                    {groupChildren.length === 0 ? (
                        <p className="text-sm text-gray-500 py-6 text-center">
                            Bu guruhda hozircha bola yo'q.
                        </p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Rasm</TableHead>
                                    <TableHead>Ism Familiya</TableHead>
                                    <TableHead>Tug'ilgan sana</TableHead>
                                    <TableHead>To'lov holati</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {groupChildren.map((child) => (
                                    <TableRow key={child.id}>
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
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}