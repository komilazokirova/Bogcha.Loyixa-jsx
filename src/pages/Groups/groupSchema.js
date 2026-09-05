import { z } from "zod";

export const groupSchema = (t) =>
  z.object({
    name: z.string().trim().min(1, t("groupForm.nameRequired")),
    teacher: z.string().trim().min(1, t("groupForm.teacherRequired")),
    ageRange: z.string().min(1, t("groupForm.ageRangeRequired")),
    capacity: z
      .union([z.string(), z.number()])
      .refine((val) => val !== "" && val !== undefined && val !== null, t("groupForm.capacityRequired"))
      .transform((val) => Number(val)),
  });