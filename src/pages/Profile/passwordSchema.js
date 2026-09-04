import { z } from "zod";

// Endi t() funksiyasini qabul qiladi — xatolik xabarlari tanlangan tilga mos keladi
export const passwordSchema = (t) =>
  z
    .object({
      currentPassword: z.string().min(1, t("errors.currentPasswordRequired")),
      newPassword: z.string().min(6, t("errors.newPasswordMin")),
      confirmPassword: z.string().min(1, t("errors.confirmPasswordRequired")),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("errors.passwordMismatch"),
      path: ["confirmPassword"],
    });