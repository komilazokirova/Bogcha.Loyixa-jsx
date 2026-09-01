import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Shield, KeyRound } from "lucide-react";
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

const roleLabels = {
  admin: "Admin",
  director: "Direktor",
  teacher: "Tarbiyachi",
};

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

  const initial = (user?.name || "F").charAt(0).toUpperCase();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink dark:text-gray-100">
          Profil va Sozlamalar
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Shaxsiy ma'lumotlaringiz va xavfsizlik sozlamalari
        </p>
      </div>

      {/* Foydalanuvchi ma'lumotlari */}
      <Card className="dark:bg-gray-900 dark:border-gray-800">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky to-bubblegum flex items-center justify-center text-2xl font-display font-bold text-white shrink-0">
              {initial}
            </div>
            <div className="space-y-1.5">
              <p className="text-lg font-semibold text-ink dark:text-gray-100">
                {user?.name || "Foydalanuvchi"}
              </p>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-sky/10 text-sky dark:bg-sky/15">
                <Shield size={12} />
                {roleLabels[user?.role] || user?.role || "—"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parolni o'zgartirish */}
      <Card className="dark:bg-gray-900 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-ink dark:text-gray-100">
            <KeyRound size={16} className="text-gray-400 dark:text-gray-500" />
            Parolni o'zgartirish
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label className="dark:text-gray-300">Joriy parol</Label>
              <Input type="password" {...register("currentPassword")} />
              {errors.currentPassword && (
                <p className="text-sm text-red-500">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="dark:text-gray-300">Yangi parol</Label>
              <Input type="password" {...register("newPassword")} />
              {errors.newPassword && (
                <p className="text-sm text-red-500">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="dark:text-gray-300">Yangi parolni tasdiqlang</Label>
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