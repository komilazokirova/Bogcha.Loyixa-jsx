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

import useChildrenStore from "@/store/childrenStore";
import useAuthStore from "@/store/authStore";
import useGroupsStore from "@/store/groupsStore";

import { groupColors } from "./mockChildren";
import { groupTypeColors } from "../Groups/mockGroups";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getChildrenRequest } from "@/api/childrenApi";

export default function Children() {
  const [search, setSearch] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("Barchasi");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const navigate = useNavigate();

  // Zustand
  const { data: children = [], isLoading } = useQuery({
    queryKey: ["children"],
    queryFn: getChildrenRequest,
    staleTime: 60 * 1000, // 1 daqiqa davomida "yangi" hisoblanadi, qayta so'ralmaydi
  });
  const removeChild = useChildrenStore((state) => state.removeChild);



  const user = useAuthStore((state) => state.user);
  const groups = useGroupsStore((state) => state.groups);

  const isTeacher = user?.role === "teacher";

  // O'qituvchining guruhi
  const teacherGroup = groups.find((group) => group.name === user?.group);

  // ID orqali guruhni topish
  const getGroupById = (groupId) => {
    return groups.find((group) => String(group.id) === String(groupId));
  };

  // Teacher faqat o'z guruhidagi bolalarni ko'radi
  const visibleChildren = isTeacher
    ? children.filter(
      (child) => String(child.groupId) === String(teacherGroup?.id)
    )
    : children;

  // Qidirish + guruh filter
  const filteredChildren = visibleChildren.filter((child) => {
    const fullName =
      `${child.firstName || ""} ${child.lastName || ""}`.toLowerCase();

    const matchesSearch = fullName.includes(search.toLowerCase());

    const matchesGroup =
      selectedGroupId === "Barchasi" ||
      String(child.groupId) === String(selectedGroupId);

    return matchesSearch && matchesGroup;
  });

  // Delete confirm
  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;

    removeChild(deleteTarget.id);

    toast.success("Bola muvaffaqiyatli o'chirildi!");

    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink dark:text-gray-100">
            {isTeacher
              ? `${user?.group || ""} guruhi bolalari`
              : "Bolalar ro'yxati"}
          </h1>

          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Jami: {filteredChildren.length} ta bola
          </p>
        </div>

        {/* Yangi bola qo'shish */}
        {!isTeacher && (
          <Link to="/children/new">
            <Button>
              <Plus size={16} className="mr-2" />
              Yangi bola qo'shish
            </Button>
          </Link>
        )}
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3">
        {/* Search */}
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

        {/* Group filter */}
        {!isTeacher && (
          <Select
            value={String(selectedGroupId)}
            onValueChange={(value) => setSelectedGroupId(value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Guruh" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="Barchasi">Barchasi</SelectItem>

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
        <p className="text-gray-500 dark:text-gray-400 text-sm">Yuklanmoqda...</p>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rasm</TableHead>
              <TableHead>Ism Familiya</TableHead>
              <TableHead>Tug'ilgan sana</TableHead>
              <TableHead>Guruh</TableHead>
              <TableHead>To'lov holati</TableHead>

              {!isTeacher && (
                <TableHead className="text-right">Amallar</TableHead>
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
                    {/* Rasm */}
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

                    {/* Ism */}
                    <TableCell className="font-medium text-ink dark:text-gray-100">
                      {child.firstName} {child.lastName}
                    </TableCell>

                    {/* Tug'ilgan sana */}
                    <TableCell className="text-gray-600 dark:text-gray-300">
                      {child.birthDate}
                    </TableCell>

                    {/* Guruh */}
                    <TableCell>
                      {childGroup ? (
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${groupTypeColors[childGroup.name] ||
                            groupColors[childGroup.name] ||
                            ""
                            }`}
                        >
                          {childGroup.name}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">
                          Belgilanmagan
                        </span>
                      )}
                    </TableCell>

                    {/* To'lov */}
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

                    {/* Actions */}
                    {!isTeacher && (
                      <TableCell
                        className="text-right space-x-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Edit */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            navigate(`/children/${child.id}/edit`)
                          }
                        >
                          <Pencil size={16} />
                        </Button>

                        {/* Delete */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteTarget(child)}
                        >
                          <Trash2
                            size={16}
                            className="text-red-500"
                          />
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
                  Bola topilmadi
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
          if (!open) {
            setDeleteTarget(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Bolani o'chirishni tasdiqlaysizmi?
            </AlertDialogTitle>

            <AlertDialogDescription>
              {deleteTarget && (
                <>
                  <strong>
                    {deleteTarget.firstName} {deleteTarget.lastName}
                  </strong>{" "}
                  ro'yxatdan butunlay o'chiriladi. Bu amalni ortga qaytarib
                  bo'lmaydi.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>
              Bekor qilish
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Ha, o'chirish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}