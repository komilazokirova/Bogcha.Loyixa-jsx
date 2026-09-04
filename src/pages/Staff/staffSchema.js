import { z } from "zod";

const phoneRegex = /^\+998\d{9}$/;

// Endi t() funksiyasini qabul qiladi — xatolik xabarlari tanlangan tilga mos keladi
export const staffSchema = (t) =>
  z.object({
    firstName: z.string().trim().min(1, t("errors.firstNameRequired")),
    lastName: z.string().trim().min(1, t("errors.lastNameRequired")),
    position: z.string().min(1, t("errors.positionRequired")),
    group: z.string().min(1, t("errors.groupRequired")),
    phone: z
      .string()
      .min(1, t("errors.phoneRequired"))
      .regex(phoneRegex, t("errors.phoneFormat")),
  });

export const staffEditSchema = staffSchema;