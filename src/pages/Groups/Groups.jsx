import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";

import useGroupsStore from "@/store/groupsStore";
import useChildrenStore from "@/store/childrenStore";
import { groupTypeColors } from "./mockGroups";

export default function Groups() {
    const [search, setSearch] = useState("");
    const groups = useGroupsStore((state) => state.groups);
    const children = useChildrenStore((state) => state.children);

    const filteredGroups = groups.filter((group) =>
        group.name.toLowerCase().includes(search.toLowerCase())
    );

    const getChildrenCount = (groupName) =>
        children.filter((child) => child.group === groupName).length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Guruhlar ro'yxati</h1>
                    <p className="text-gray-500 text-sm">
                        Jami: {filteredGroups.length} ta guruh
                    </p>
                </div>
                <Link to="/groups/new">
                    <Button>
                        <Plus size={16} className="mr-2" />
                        Yangi guruh qo'shish
                    </Button>
                </Link>
            </div>

            {/* Qidiruv */}
            <div className="relative max-w-sm">
                <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <Input
                    placeholder="Guruh nomi bo'yicha qidirish..."
                    className="pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Guruh kartalari */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGroups.map((group) => (
                    <Link key={group.id} to={`/groups/${group.id}`}>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-base">{group.name}</CardTitle>
                                <span
                                    className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${groupTypeColors[group.name] || ""}`}
                                >
                                    {group.ageRange}
                                </span>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Tarbiyachi: <span className="text-gray-800 dark:text-gray-200">{group.teacher}</span>
                                </p>
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <Users size={14} />
                                    <span>
                                        {getChildrenCount(group.name)} / {group.capacity} bola
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}