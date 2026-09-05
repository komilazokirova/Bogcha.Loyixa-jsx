import { z } from "zod";

const phoneRegex = /^\+998\d{9}$/;
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

// Endi t() funksiyasini qabul qiladi — xatolik xabarlari tanlangan tilga mos
export const buildChildSchema = (t) => {
  const requiredFileField = (message) =>
    z
      .any()
      .refine((val) => val instanceof File, message)
      .refine(
        (val) => !(val instanceof File) || val.size <= MAX_FILE_SIZE,
        t("errors.fileSize")
      );

  const optionalFileField = () =>
    z.any().optional().refine(
      (val) => !(val instanceof File) || val.size <= MAX_FILE_SIZE,
      t("errors.fileSize")
    );

  const baseFields = {
    firstName: z.string().min(1, t("errors.firstNameRequired")),
    lastName: z.string().min(1, t("errors.lastNameRequired")),
    birthDate: z.string().min(1, t("errors.birthDateRequired")),
    gender: z.string().min(1, t("errors.genderRequired")),
    groupId: z.union([z.string(), z.number()]).refine(
      (val) => val !== "" && val !== undefined && val !== null,
      t("errors.groupIdRequired")
    ),
    address: z.string().min(1, t("errors.addressRequired")),
    fatherName: z.string().min(1, t("errors.fatherNameRequired")),
    fatherPhone: z
      .string()
      .min(1, t("errors.fatherPhoneRequired"))
      .regex(phoneRegex, t("errors.phoneFormat")),
    motherName: z.string().min(1, t("errors.motherNameRequired")),
    motherPhone: z
      .string()
      .min(1, t("errors.motherPhoneRequired"))
      .regex(phoneRegex, t("errors.phoneFormat")),
  };

  const childSchema = z.object({
    ...baseFields,
    childPhoto: requiredFileField(t("errors.childPhotoRequired")),
    birthCertificate: requiredFileField(t("errors.birthCertRequired")),
    fatherPassport: requiredFileField(t("errors.fatherPassportRequired")),
    motherPassport: requiredFileField(t("errors.motherPassportRequired")),
    contract: requiredFileField(t("errors.contractRequired")),
  });

  const childEditSchema = z.object({
    ...baseFields,
    childPhoto: optionalFileField(),
    birthCertificate: optionalFileField(),
    fatherPassport: optionalFileField(),
    motherPassport: optionalFileField(),
    contract: optionalFileField(),
  });

  return { childSchema, childEditSchema };
};