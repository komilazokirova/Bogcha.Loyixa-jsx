import { z } from "zod";

// Endi t() funksiyasini qabul qiladi — xatolik xabarlari tanlangan tilga mos keladi
export const loginSchema = (t) =>
  z.object({
    email: z
      .string()
      .min(1, t("errors.emailRequired"))
      .email(t("errors.emailFormat")),
    password: z
      .string()
      .min(1, t("errors.passwordRequired"))
      .min(6, t("errors.passwordMin")),
  });