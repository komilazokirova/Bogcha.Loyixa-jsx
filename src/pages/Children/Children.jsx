import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import useAuthStore from "@/store/authStore";
import useGroupsStore from "@/store/groupsStore";

import { groupColors } from "./mockChildren";
import { groupTypeColors } from "../Groups/mockGroups";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getChildrenRequest, deleteChildRequest } from "@/api/childrenApi";
import { useTranslation } from "@/i18n/useTranslation";

export default function Children() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("Barchasi");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: children = [], isLoading } = useQuery({
    queryKey: ["children"],
    queryFn: getChildrenRequest,
    staleTime: 60 * 1000,
  });

  const user = useAuthStore((state) => state.user);
  const groups = useGroupsStore((state) => state.groups);

  const isTeacher = user?.role === "teacher";
  const teacherGroup = groups.find((group) => group.name === user?.group);

  const getGroupById = (groupId) => {
    return groups.find((group) => String(group.id) === String(groupId));
  };

  const visibleChildren = isTeacher
    ? children.filter(
        (child) => String(child.groupId) === String(teacherGroup?.id)
      )
    : children;

  const filteredChildren = visibleChildren.filter((child) => {
    const fullName =
      `${child.firstName || ""} ${child.lastName || ""}`.toLowerCase();
    const matchesSearch = fullName.includes(search.toLowerCase());
    const matchesGroup =
      selectedGroupId === "Barchasi" ||
      String(child.groupId) === String(selectedGroupId);
    return matchesSearch && matchesGroup;
  });

  const deleteMutation = useMutation({
    mutationFn: deleteChildRequest,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["children"] });
      const previousChildren = queryClient.getQueryData(["children"]);
      queryClient.setQueryData(["children"], (old = []) =>
        old.filter((c) => String(c.id) !== String(id))
      );
      return { previousChildren };
    },
    onError: (error, id, context) => {
      queryClient.setQueryData(["children"], context.previousChildren);
      toast.error(t("children.deleteErrorToast"));
    },
    onSuccess: () => {
      toast.success(t("children.deletedToast"));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["children"] });
    },
  });

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink dark:text-gray-100">
            {isTeacher
              ? t("children.groupChildren", { group: user?.group || "" })
              : t("children.listTitle")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {t("children.totalCount", { count: filteredChildren.length })}
          </p>
        </div>

        {!isTeacher && (
          <Link to="/children/new">
            <Button>
              <Plus size={16} className="mr-2" />
              {t("children.addNew")}
            </Button>
          </Link>
        )}
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <Input
            placeholder={t("children.searchPlaceholder")}
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {!isTeacher && (
          <Select
            value={String(selectedGroupId)}
            onValueChange={(value) => setSelectedGroupId(value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t("children.group")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Barchasi">{t("common.all")}</SelectItem>
              {groups.map((group) => (
                <SelectItem key={group.id} value={String(group.id)}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {isLoading && (
        <p className="text-gray-500 dark:text-gray-400 text-sm">{t("loading")}</p>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("children.photo")}</TableHead>
              <TableHead>{t("children.fullName")}</TableHead>
              <TableHead>{t("children.birthDate")}</TableHead>
              <TableHead>{t("children.group")}</TableHead>
              <TableHead>{t("children.paymentStatus")}</TableHead>
              {!isTeacher && (
                <TableHead className="text-right">{t("common.actions")}</TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredChildren.length > 0 ? (
              filteredChildren.map((child) => {
                const childGroup = getGroupById(child.groupId);
                return (
                  <TableRow
                    key={child.id}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
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
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-500 dark:text-gray-300">
                          {child.firstName?.[0]}
                          {child.lastName?.[0]}
                        </div>
                      )}
                    </TableCell>

                    <TableCell className="font-medium text-ink dark:text-gray-100">
                      {child.firstName} {child.lastName}
                    </TableCell>

                    <TableCell className="text-gray-600 dark:text-gray-300">
                      {child.birthDate}
                    </TableCell>

                    <TableCell>
                      {childGroup ? (
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                            groupTypeColors[childGroup.name] ||
                            groupColors[childGroup.name] ||
                            ""
                          }`}
                        >
                          {childGroup.name}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">
                          {t("common.none")}
                        </span>
                      )}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          child.paymentStatus === "to'langan"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {t("paymentStatus." + child.paymentStatus) || child.paymentStatus}
                      </Badge>
                    </TableCell>

                    {!isTeacher && (
                      <TableCell
                        className="text-right space-x-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            navigate(`/children/${child.id}/edit`)
                          }
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteTarget(child)}
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={isTeacher ? 5 : 6}
                  className="text-center py-10 text-gray-500"
                >
                  {t("children.noChild")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("children.deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget && (
                <>
                  <strong>
                    {deleteTarget.firstName} {deleteTarget.lastName}
                  </strong>{" "}
                  {t("children.deleteDesc")}
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {t("children.deleteYes")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}