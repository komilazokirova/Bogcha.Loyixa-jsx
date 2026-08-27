import { z } from "zod";

const phoneRegex = /^\+998\d{9}$/;

const fileField = (message) =>
  z
    .any()
    .refine((val) => val instanceof File, message);

export const childSchema = z.object({
  firstName: z.string().min(1, "Ism kiritish shart"),
  lastName: z.string().min(1, "Familiya kiritish shart"),
  birthDate: z.string().min(1, "Tug'ilgan sana kiritish shart"),
  gender: z.string().min(1, "Jinsini tanlash shart"),
  group: z.string().min(1, "Guruhni tanlash shart"),
  address: z.string().min(1, "Manzil kiritish shart"),

  fatherName: z.string().min(1, "Otasining F.I.Sh kiritish shart"),
  fatherPhone: z
    .string()
    .min(1, "Otasining telefon raqami kiritish shart")
    .regex(phoneRegex, "Format: +998901234567"),

  motherName: z.string().min(1, "Onasining F.I.Sh kiritish shart"),
  motherPhone: z
    .string()
    .min(1, "Onasining telefon raqami kiritish shart")
    .regex(phoneRegex, "Format: +998901234567"),

  childPhoto: fileField("Bolaning rasmini yuklash shart"),
  birthCertificate: fileField("Metrika rasmini yuklash shart"),
  fatherPassport: fileField("Otaning pasport nusxasini yuklash shart"),
  motherPassport: fileField("Onaning pasport nusxasini yuklash shart"),
  contract: fileField("Shartnomani yuklash shart"),
});