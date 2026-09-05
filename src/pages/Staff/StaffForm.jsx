import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { useMemo } from "react";
import { ArrowLeft, Loader2, UserRound } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import { staffSchema } from "./staffSchema";
import useStaffStore from "@/store/staffStore";
import { addStaffRequest, updateStaffRequest } from "@/api/staffApi";
import { useTranslation } from "@/i18n/useTranslation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PhoneInput from "@/components/PhoneInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { positionOptions, staffGroupOptions } from "./mockStaff";

export default function StaffForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const staff = useStaffStore((s) => s.staff);
  const addStaff = useStaffStore((s) => s.addStaff);
  const updateStaff = useStaffStore((s) => s.updateStaff);

  const existing = isEditMode ? staff.find((s) => String(s.id) === id) : null;

  const schema = useMemo(() => staffSchema(t), [t]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: existing?.firstName || "",
      lastName: existing?.lastName || "",
      position: existing?.position || "",
      group: existing?.group || "-",
      phone: existing?.phone || "",
    },
  });

  const mutation = useMutation({
    mutationFn: isEditMode ? updateStaffRequest : addStaffRequest,
    onSuccess: (result) => {
      if (isEditMode) updateStaff(result);
      else addStaff(result);
      toast.success(isEditMode ? t("staffForm.updated") : t("staffForm.saved"));
      navigate("/staff");
    },
    onError: (error) => {
      console.error("Staff error:", error);
      toast.error(t("staffForm.error"));
    },
  });

  const onSubmit = (data) => {
    const payload = {
      ...(isEditMode ? { id: existing.id } : {}),
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      position: data.position,
      group: data.group,
      phone: data.phone,
    };
    mutation.mutate(payload);
  };

  const onInvalid = () => {
    toast.error(t("staffForm.invalid"));
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <Button type="button" variant="ghost" size="icon" onClick={() => navigate("/staff")}>
          <ArrowLeft size={18} />
        </Button>
        <div>
          <h1 className="font-display text-2xl font-bold text-ink dark:text-gray-100">
            {isEditMode ? t("staffForm.editTitle") : t("staffForm.addTitle")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {isEditMode ? t("staffForm.editSubtitle") : t("staffForm.addSubtitle")}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <UserRound size={16} className="text-sky" />
              {t("staffForm.personal")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("staffForm.firstName")}</Label>
                <Input {...register("firstName")} placeholder={t("staffForm.firstName")} />
                {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>{t("staffForm.lastName")}</Label>
                <Input {...register("lastName")} placeholder={t("staffForm.lastName")} />
                {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t("staffForm.position")}</Label>
              <Controller
                name="position"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("staffForm.positionPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {positionOptions.map((p) => (
                        <SelectItem key={p} value={p}>
                          {t("positions." + p)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.position && <p className="text-sm text-red-500">{errors.position.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>{t("staffForm.group")}</Label>
              <Controller
                name="group"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("staffForm.groupPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {staffGroupOptions.map((g) => (
                        <SelectItem key={g} value={g}>
                          {g === "-" ? t("staff.noGroup") : g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.group && <p className="text-sm text-red-500">{errors.group.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>{t("staffForm.phone")}</Label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => <PhoneInput value={field.value} onChange={field.onChange} />}
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                {t("common.saving")}
              </>
            ) : (
              t("common.save")
            )}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/staff")} disabled={mutation.isPending}>
            {t("common.cancel")}
          </Button>
        </div>
      </form>
    </div>
  );
}