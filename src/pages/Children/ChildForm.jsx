import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Loader2,
    CheckCircle2,
    Baby,
    UserRound,
    FileStack,
} from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import { childSchema, childEditSchema } from "./childSchema";
import useChildrenStore from "@/store/childrenStore";
import useGroupsStore from "@/store/groupsStore";
import { addChildRequest, updateChildRequest } from "@/api/childrenApi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PhoneInput from "@/components/PhoneInput";
import FileUpload from "@/components/FileUpload";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

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

    const [status, setStatus] = useState(null);

    const addChild = useChildrenStore((state) => state.addChild);
    const updateChildOptimistic = useChildrenStore((state) => state.updateChildOptimistic);
    const children = useChildrenStore((state) => state.children);
    const groups = useGroupsStore((state) => state.groups);

    // Tahrirlash rejimida bo'lsa, mavjud bolani topamiz
    const existingChild = isEditMode
        ? children.find((c) => String(c.id) === id)
        : null;

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(isEditMode ? childEditSchema : childSchema),

        // Tahrirlashda — mavjud ma'lumotlar bilan to'ldiramiz,
        // qo'shishda — bo'sh maydonlar bilan boshlaymiz
        defaultValues: {
            firstName: existingChild?.firstName || "",
            lastName: existingChild?.lastName || "",
            birthDate: existingChild?.birthDate || "",
            gender: existingChild?.gender || "",
            groupId: existingChild?.groupId || "",
            address: existingChild?.address || "",
            fatherName: existingChild?.fatherName || "",
            fatherPhone: existingChild?.fatherPhone || "",
            motherName: existingChild?.motherName || "",
            motherPhone: existingChild?.motherPhone || "",
            childPhoto: null,
            birthCertificate: null,
            fatherPassport: null,
            motherPassport: null,
            contract: null,
        },
    });

    const mutation = useMutation({
        mutationFn: isEditMode ? updateChildRequest : addChildRequest,

        onMutate: () => {
            setStatus("saving");
        },

        onSuccess: (resultChild) => {
            if (isEditMode) {
                updateChildOptimistic(existingChild.id, resultChild);
            } else {
                addChild(resultChild);
            }

            setStatus("success");

            toast.success(
                isEditMode
                    ? "Bola muvaffaqiyatli yangilandi!"
                    : "Bola muvaffaqiyatli qo'shildi!"
            );

            setTimeout(() => {
                navigate("/children");
            }, 1500);
        },

        onError: (error) => {
            console.error("Child error:", error);

            setStatus(null);

            toast.error("Bola saqlanmadi. Qayta urinib ko'ring.");
        },
    });

    const onSubmit = (data) => {
        const groupIdNum = Number(data.groupId);

        if (!isEditMode) {
            const targetGroup = groups.find((g) => g.id === groupIdNum);
            const currentCount = children.filter(
                (c) => c.groupId === groupIdNum
            ).length;

            if (targetGroup && currentCount >= targetGroup.capacity) {
                toast.error(
                    `"${targetGroup.name}" guruhi to'liq (${targetGroup.capacity} o'rin). Boshqa guruh tanlang yoki mavjud o'rinni bo'shating.`
                );
                return;
            }
        }

        // Yangi fayl yuklangan bo'lsa — yangi URL yaratamiz,
        // yuklanmagan bo'lsa (tahrirlashda) — eski URL saqlanib qoladi
        const photoUrl = data.childPhoto instanceof File
            ? URL.createObjectURL(data.childPhoto)
            : existingChild?.photoUrl || null;
        const birthCertificateUrl = data.birthCertificate instanceof File
            ? URL.createObjectURL(data.birthCertificate)
            : existingChild?.birthCertificateUrl || null;
        const fatherPassportUrl = data.fatherPassport instanceof File
            ? URL.createObjectURL(data.fatherPassport)
            : existingChild?.fatherPassportUrl || null;
        const motherPassportUrl = data.motherPassport instanceof File
            ? URL.createObjectURL(data.motherPassport)
            : existingChild?.motherPassportUrl || null;
        const contractUrl = data.contract instanceof File
            ? URL.createObjectURL(data.contract)
            : existingChild?.contractUrl || null;

        const payload = {
            ...(isEditMode ? { id: existingChild.id } : {}),
            firstName: data.firstName,
            lastName: data.lastName,
            birthDate: data.birthDate,
            gender: data.gender,
            groupId: groupIdNum,
            address: data.address,
            fatherName: data.fatherName,
            fatherPhone: data.fatherPhone,
            motherName: data.motherName,
            motherPhone: data.motherPhone,
            photoUrl,
            birthCertificateUrl,
            fatherPassportUrl,
            motherPassportUrl,
            contractUrl,
        };

        mutation.mutate(payload);
    };

    const onInvalid = (errors) => {
        console.log("Form xatolari:", errors);

        toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring.");
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            {/* HEADER */}
            <div className="flex items-center gap-3">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate("/children")}
                >
                    <ArrowLeft size={18} />
                </Button>

                <div>
                    <h1 className="font-display text-2xl font-bold text-ink dark:text-gray-100">
                        {isEditMode ? "Bolani tahrirlash" : "Yangi bola qo'shish"}
                    </h1>

                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {isEditMode
                            ? "Bola ma'lumotlarini yangilang"
                            : "Barcha maydonlarni to'ldiring"}
                    </p>
                </div>
            </div>

            {/* SAVING */}
            {status === "saving" && (
                <div className="flex items-center gap-2 bg-sky/10 text-sky px-4 py-3 rounded-xl text-sm font-medium">
                    <Loader2 size={16} className="animate-spin" />
                    Ma'lumotlar saqlanmoqda...
                </div>
            )}

            {/* SUCCESS */}
            {status === "success" && (
                <div className="flex items-center gap-2 bg-grass/10 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium">
                    <CheckCircle2 size={16} />
                    {isEditMode ? "Bola muvaffaqiyatli yangilandi!" : "Bola muvaffaqiyatli qo'shildi!"}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6">
                {/* BOLA */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Baby size={16} className="text-bubblegum" />
                            Bola haqida ma'lumot
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Ism</Label>
                                <Input {...register("firstName")} placeholder="Ism" />
                                {errors.firstName && (
                                    <p className="text-sm text-red-500">
                                        {errors.firstName.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Familiya</Label>
                                <Input {...register("lastName")} placeholder="Familiya" />
                                {errors.lastName && (
                                    <p className="text-sm text-red-500">
                                        {errors.lastName.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Tug'ilgan sana</Label>
                                <Input type="date" {...register("birthDate")} />
                                {errors.birthDate && (
                                    <p className="text-sm text-red-500">
                                        {errors.birthDate.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Jinsi</Label>
                                <Controller
                                    name="gender"
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Tanlang" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="o'g'il">O'g'il bola</SelectItem>
                                                <SelectItem value="qiz">Qiz bola</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.gender && (
                                    <p className="text-sm text-red-500">
                                        {errors.gender.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Guruh</Label>
                            <Controller
                                name="groupId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        value={field.value ? String(field.value) : ""}
                                        onValueChange={(val) => field.onChange(Number(val))}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Guruhni tanlang" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {groups.map((group) => (
                                                <SelectItem key={group.id} value={String(group.id)}>
                                                    {group.name} ({group.ageRange})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.groupId && (
                                <p className="text-sm text-red-500">
                                    {errors.groupId.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Manzil</Label>
                            <Input {...register("address")} placeholder="Manzil" />
                            {errors.address && (
                                <p className="text-sm text-red-500">
                                    {errors.address.message}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* OTASI */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <UserRound size={16} className="text-sky" />
                            Otasi haqida ma'lumot
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Otasining F.I.Sh</Label>
                            <Input {...register("fatherName")} placeholder="Otasining F.I.Sh" />
                            {errors.fatherName && (
                                <p className="text-sm text-red-500">
                                    {errors.fatherName.message}
                                </p>
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
                                <p className="text-sm text-red-500">
                                    {errors.fatherPhone.message}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* ONASI */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <UserRound size={16} className="text-grass" />
                            Onasi haqida ma'lumot
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Onasining F.I.Sh</Label>
                            <Input {...register("motherName")} placeholder="Onasining F.I.Sh" />
                            {errors.motherName && (
                                <p className="text-sm text-red-500">
                                    {errors.motherName.message}
                                </p>
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
                                <p className="text-sm text-red-500">
                                    {errors.motherPhone.message}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* HUJJATLAR */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <FileStack size={16} className="text-sun" />
                            Hujjatlar
                        </CardTitle>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                            {isEditMode
                                ? "Faqat almashtirmoqchi bo'lgan fayllarni yuklang. Har bir fayl hajmi 2MB dan oshmasligi kerak"
                                : "Har bir fayl hajmi 2MB dan oshmasligi kerak"}
                        </p>
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
                                existingFileUrl={existingChild?.photoUrl}
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
                                existingFileUrl={existingChild?.birthCertificateUrl}
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
                                existingFileUrl={existingChild?.fatherPassportUrl}
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
                                existingFileUrl={existingChild?.motherPassportUrl}
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
                                existingFileUrl={existingChild?.contractUrl}
                            />
                        )}
                    />
                </CardContent>
            </Card>

            {/* BUTTONS */}
            <div className="flex gap-3">
                <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? (
                        <>
                            <Loader2 size={16} className="mr-2 animate-spin" />
                            Saqlanmoqda...
                        </>
                    ) : (
                        "Saqlash"
                    )}
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/children")}
                    disabled={mutation.isPending}
                >
                    Bekor qilish
                </Button>
            </div>
        </form>
        </div >
    );
}