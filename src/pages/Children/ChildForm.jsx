import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { childSchema } from "./childSchema";
import { groupOptions } from "./mockChildren";
import useChildrenStore from "@/store/childrenStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PhoneInput from "@/components/PhoneInput";
import FileUpload from "@/components/FileUpload";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export default function ChildForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const addChild = useChildrenStore((state) => state.addChild);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(childSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      birthDate: "",
      gender: "",
      group: "",
      address: "",
      fatherName: "",
      fatherPhone: "",
      motherName: "",
      motherPhone: "",
      childPhoto: null,
      birthCertificate: null,
      fatherPassport: null,
      motherPassport: null,
      contract: null,
    },
  });

  const onSubmit = async (data) => {
    // TODO: Backend tayyor bo'lgach, FormData orqali yuboriladi (fayllar bor bo'lgani uchun)
    // const formData = new FormData();
    // Object.entries(data).forEach(([key, value]) => formData.append(key, value));
    // await axiosInstance.post("/children", formData, { headers: { "Content-Type": "multipart/form-data" } });

     const photoUrl = data.childPhoto ? URL.createObjectURL(data.childPhoto) : null;

  addChild({
    firstName: data.firstName,
    lastName: data.lastName,
    birthDate: data.birthDate,
    group: data.group,
    photoUrl,
  });

  toast.success("Bola muvaffaqiyatli qo'shildi!");
  navigate("/children");
};

  const groupChoices = groupOptions.filter((g) => g !== "Barchasi");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/children")}>
          <ArrowLeft size={18} />
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditMode ? "Bolani tahrirlash" : "Yangi bola qo'shish"}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        {/* Shaxsiy ma'lumotlar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Bola haqida ma'lumot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ism</Label>
                <Input {...register("firstName")} />
                {errors.firstName && (
                  <p className="text-sm text-red-500">{errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Familiya</Label>
                <Input {...register("lastName")} />
                {errors.lastName && (
                  <p className="text-sm text-red-500">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tug'ilgan sana</Label>
                <Input type="date" {...register("birthDate")} />
                {errors.birthDate && (
                  <p className="text-sm text-red-500">{errors.birthDate.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Jinsi</Label>
                <select
                  {...register("gender")}
                  className="w-full h-9 border rounded-md px-3 text-sm bg-white"
                >
                  <option value="">Tanlang</option>
                  <option value="o'g'il">O'g'il bola</option>
                  <option value="qiz">Qiz bola</option>
                </select>
                {errors.gender && (
                  <p className="text-sm text-red-500">{errors.gender.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Guruh</Label>
              <select
                {...register("group")}
                className="w-full h-9 border rounded-md px-3 text-sm bg-white"
              >
                <option value="">Tanlang</option>
                {groupChoices.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              {errors.group && (
                <p className="text-sm text-red-500">{errors.group.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Manzil</Label>
              <Input {...register("address")} />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Otasi haqida */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Otasi haqida ma'lumot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Otasining F.I.Sh</Label>
              <Input {...register("fatherName")} />
              {errors.fatherName && (
                <p className="text-sm text-red-500">{errors.fatherName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Otasining telefon raqami</Label>
              <Controller
                name="fatherPhone"
                control={control}
                render={({ field }) => (
                  <PhoneInput value={field.value} onChange={field.onChange} />
                )}
              />
              {errors.fatherPhone && (
                <p className="text-sm text-red-500">{errors.fatherPhone.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Onasi haqida */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Onasi haqida ma'lumot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Onasining F.I.Sh</Label>
              <Input {...register("motherName")} />
              {errors.motherName && (
                <p className="text-sm text-red-500">{errors.motherName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Onasining telefon raqami</Label>
              <Controller
                name="motherPhone"
                control={control}
                render={({ field }) => (
                  <PhoneInput value={field.value} onChange={field.onChange} />
                )}
              />
              {errors.motherPhone && (
                <p className="text-sm text-red-500">{errors.motherPhone.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Hujjatlar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hujjatlar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Controller
              name="childPhoto"
              control={control}
              render={({ field }) => (
                <FileUpload
                  label="Bolaning rasmi"
                  onChange={field.onChange}
                  error={errors.childPhoto?.message}
                />
              )}
            />
            <Controller
              name="birthCertificate"
              control={control}
              render={({ field }) => (
                <FileUpload
                  label="Metrika (tug'ilganlik guvohnomasi) rasmi"
                  onChange={field.onChange}
                  error={errors.birthCertificate?.message}
                />
              )}
            />
            <Controller
              name="fatherPassport"
              control={control}
              render={({ field }) => (
                <FileUpload
                  label="Otaning pasport nusxasi"
                  onChange={field.onChange}
                  error={errors.fatherPassport?.message}
                />
              )}
            />
            <Controller
              name="motherPassport"
              control={control}
              render={({ field }) => (
                <FileUpload
                  label="Onaning pasport nusxasi"
                  onChange={field.onChange}
                  error={errors.motherPassport?.message}
                />
              )}
            />
            <Controller
              name="contract"
              control={control}
              render={({ field }) => (
                <FileUpload
                  label="Shartnoma"
                  onChange={field.onChange}
                  error={errors.contract?.message}
                />
              )}
            />
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saqlanmoqda..." : "Saqlash"}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/children")}>
            Bekor qilish
          </Button>
        </div>
      </form>
    </div>
  );
}