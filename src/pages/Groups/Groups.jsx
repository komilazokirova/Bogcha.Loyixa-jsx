import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import useGroupsStore from "@/store/groupsStore";
import useChildrenStore from "@/store/childrenStore";
import { groupTypeColors } from "./mockGroups";
import { useTranslation } from "@/i18n/useTranslation";

export default function Groups() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const groups = useGroupsStore((state) => state.groups);
  const children = useChildrenStore((state) => state.children);

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(search.toLowerCase())
  );

  // TUZATILDI: guruh nomi bilan emas, guruh ID'si bilan solishtiramiz
  const getChildrenCount = (group) =>
    children.filter((child) => String(child.groupId) === String(group.id)).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("groups.title")}</h1>
          <p className="text-gray-500 text-sm">
            {t("groups.totalCount", { count: filteredGroups.length })}
          </p>
        </div>
        <Link to="/groups/new">
          <Button>
            <Plus size={16} className="mr-2" />
            {t("groups.addNew")}
          </Button>
        </Link>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder={t("groups.searchPlaceholder")}
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGroups.map((group) => (
          <Link key={group.id} to={`/groups/${group.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base">{group.name}</CardTitle>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                    groupTypeColors[group.name] || ""
                  }`}
                >
                  {group.ageRange}
                </span>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t("groups.teacher")}:{" "}
                  <span className="text-gray-800 dark:text-gray-200">{group.teacher}</span>
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Users size={14} />
                  <span>
                    {getChildrenCount(group)} / {group.capacity} {t("groups.childUnit")}
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