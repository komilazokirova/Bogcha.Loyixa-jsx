import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { User, Mail, Shield } from "lucide-react";
import { passwordSchema } from "./passwordSchema";
import useAuthStore from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export default function Profile() {
  const user = useAuthStore((state) => state.user);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data) => {
    // TODO: Backend tayyor bo'lgach:
    // await axiosInstance.post("/auth/change-password", data);
    await new Promise((resolve) => setTimeout(resolve, 600));
    toast.success("Parol muvaffaqiyatli o'zgartirildi!");
    reset();
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Profil va Sozlamalar</h1>
        <p className="text-gray-500 text-sm">
          Shaxsiy ma'lumotlaringiz va xavfsizlik sozlamalari
        </p>
      </div>

      {/* Foydalanuvchi ma'lumotlari */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Foydalanuvchi ma'lumotlari</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <User size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Ism</p>
              <p className="font-medium">{user?.name || "Foydalanuvchi"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
              <Shield size={18} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Rol</p>
              <p className="font-medium capitalize">{user?.role || "—"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parolni o'zgartirish */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Parolni o'zgartirish</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Joriy parol</Label>
              <Input type="password" {...register("currentPassword")} />
              {errors.currentPassword && (
                <p className="text-sm text-red-500">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Yangi parol</Label>
              <Input type="password" {...register("newPassword")} />
              {errors.newPassword && (
                <p className="text-sm text-red-500">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Yangi parolni tasdiqlang</Label>
              <Input type="password" {...register("confirmPassword")} />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saqlanmoqda..." : "Parolni o'zgartirish"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}