import { z } from "zod";

const phoneRegex = /^\+998\d{9}$/;

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

// Yangi bola qo'shishda: fayl albatta File bo'lishi shart
const requiredFileField = (message) =>
    z
        .any()
        .refine((val) => val instanceof File, message)
        .refine(
            (val) => !(val instanceof File) || val.size <= MAX_FILE_SIZE,
            "Fayl hajmi 2MB dan oshmasligi kerak"
        );

// Tahrirlashda: fayl ixtiyoriy (foydalanuvchi almashtirmasa, eski fayl qoladi)
const optionalFileField = () =>
    z
        .any()
        .optional()
        .refine(
            (val) => !(val instanceof File) || val.size <= MAX_FILE_SIZE,
            "Fayl hajmi 2MB dan oshmasligi kerak"
        );

const baseFields = {
    firstName: z.string().min(1, "Ism kiritish shart"),
    lastName: z.string().min(1, "Familiya kiritish shart"),
    birthDate: z.string().min(1, "Tug'ilgan sana kiritish shart"),
    gender: z.string().min(1, "Jinsini tanlash shart"),
    groupId: z.union([z.string(), z.number()]).refine(
        (val) => val !== "" && val !== undefined && val !== null,
        "Guruhni tanlash shart"
    ),
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
};

// Yangi bola qo'shish uchun (barcha fayllar majburiy)
export const childSchema = z.object({
    ...baseFields,
    childPhoto: requiredFileField("Bolaning rasmini yuklash shart"),
    birthCertificate: requiredFileField("Metrika rasmini yuklash shart"),
    fatherPassport: requiredFileField("Otaning pasport nusxasini yuklash shart"),
    motherPassport: requiredFileField("Onaning pasport nusxasini yuklash shart"),
    contract: requiredFileField("Shartnomani yuklash shart"),
});

// Bolani tahrirlash uchun (fayllar ixtiyoriy — o'zgartirmasa eskisi qoladi)
export const childEditSchema = z.object({
    ...baseFields,
    childPhoto: optionalFileField(),
    birthCertificate: optionalFileField(),
    fatherPassport: optionalFileField(),
    motherPassport: optionalFileField(),
    contract: optionalFileField(),
});