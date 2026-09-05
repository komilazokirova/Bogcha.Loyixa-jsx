import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { ArrowLeft, Loader2, UsersRound } from "lucide-react";
import { toast } from "sonner";

import { groupSchema } from "./groupSchema";
import useGroupsStore from "@/store/groupsStore";
import { useTranslation } from "@/i18n/useTranslation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function GroupForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const addGroup = useGroupsStore((s) => s.addGroup);

  const schema = useMemo(() => groupSchema(t), [t]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", teacher: "", ageRange: "", capacity: "" },
  });

  const onSubmit = (data) => {
    addGroup({
      name: data.name.trim(),
      teacher: data.teacher.trim(),
      ageRange: data.ageRange.trim(),
      capacity: data.capacity,
    });
    toast.success(t("groupForm.saved"));
    navigate("/groups");
  };

  const onInvalid = () => toast.error(t("groupForm.invalid"));

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <Button type="button" variant="ghost" size="icon" onClick={() => navigate("/groups")}>
          <ArrowLeft size={18} />
        </Button>
        <div>
          <h1 className="font-display text-2xl font-bold text-ink dark:text-gray-100">
            {t("groupForm.addTitle")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {t("groupForm.addSubtitle")}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <UsersRound size={16} className="text-grass" />
              {t("groupForm.info")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t("groupForm.name")}</Label>
              <Input {...register("name")} placeholder={t("groupForm.name")} />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>{t("groupForm.teacher")}</Label>
              <Input {...register("teacher")} placeholder={t("groupForm.teacher")} />
              {errors.teacher && <p className="text-sm text-red-500">{errors.teacher.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>{t("groupForm.ageRange")}</Label>
              <Input {...register("ageRange")} placeholder={t("groupForm.ageRangePlaceholder")} />
              {errors.ageRange && <p className="text-sm text-red-500">{errors.ageRange.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>{t("groupForm.capacity")}</Label>
              <Input
                type="number"
                min="1"
                {...register("capacity")}
                placeholder={t("groupForm.capacity")}
              />
              {errors.capacity && <p className="text-sm text-red-500">{errors.capacity.message}</p>}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 mt-6">
          <Button type="submit">
            <Loader2 size={16} className="mr-2" />
            {t("common.save")}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/groups")}>
            {t("common.cancel")}
          </Button>
        </div>
      </form>
    </div>
  );
}