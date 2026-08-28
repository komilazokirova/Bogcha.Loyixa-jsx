
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

import { childSchema } from "./childSchema";
import { groupOptions } from "./mockChildren";
import useChildrenStore from "@/store/childrenStore";
import { addChildRequest } from "@/api/childrenApi";

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

    const addChild = useChildrenStore(
        (state) => state.addChild
    );

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
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

    const mutation = useMutation({
        mutationFn: addChildRequest,

        onMutate: () => {
            setStatus("saving");
        },

        onSuccess: (newChild) => {
            addChild(newChild);

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

            toast.error(
                "Bola saqlanmadi. Qayta urinib ko'ring."
            );
        },
    });

    const onSubmit = (data) => {
        console.log("Yuborilayotgan data:", data);

        mutation.mutate(data);
    };

    const onInvalid = (errors) => {
        console.log("Form xatolari:", errors);

        toast.error(
            "Iltimos, barcha majburiy maydonlarni to'ldiring."
        );
    };

    const groupChoices = groupOptions.filter(
        (group) => group !== "Barchasi"
    );

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
                    <h1 className="font-display text-2xl font-bold text-ink">
                        {isEditMode
                            ? "Bolani tahrirlash"
                            : "Yangi bola qo'shish"}
                    </h1>

                    <p className="text-gray-500 text-sm">
                        {isEditMode
                            ? "Bola ma'lumotlarini yangilang"
                            : "Barcha maydonlarni to'ldiring"}
                    </p>
                </div>

            </div>

            {/* SAVING */}
            {status === "saving" && (
                <div className="flex items-center gap-2 bg-sky/10 text-sky px-4 py-3 rounded-xl text-sm font-medium">
                    <Loader2
                        size={16}
                        className="animate-spin"
                    />
                    Ma'lumotlar saqlanmoqda...
                </div>
            )}

            {/* SUCCESS */}
            {status === "success" && (
                <div className="flex items-center gap-2 bg-grass/10 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium">
                    <CheckCircle2 size={16} />
                    Bola muvaffaqiyatli qo'shildi!
                </div>
            )}

            <form
                onSubmit={handleSubmit(
                    onSubmit,
                    onInvalid
                )}
                className="space-y-6"
            >

                {/* BOLA */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Baby
                                size={16}
                                className="text-bubblegum"
                            />
                            Bola haqida ma'lumot
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">

                        <div className="grid grid-cols-2 gap-4">

                            <div className="space-y-2">
                                <Label>Ism</Label>

                                <Input
                                    {...register("firstName")}
                                    placeholder="Ism"
                                />

                                {errors.firstName && (
                                    <p className="text-sm text-red-500">
                                        {errors.firstName.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Familiya</Label>

                                <Input
                                    {...register("lastName")}
                                    placeholder="Familiya"
                                />

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

                                <Input
                                    type="date"
                                    {...register("birthDate")}
                                />

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
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Tanlang" />
                                            </SelectTrigger>

                                            <SelectContent>
                                                <SelectItem value="o'g'il">
                                                    O'g'il bola
                                                </SelectItem>

                                                <SelectItem value="qiz">
                                                    Qiz bola
                                                </SelectItem>
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
                                name="group"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Guruhni tanlang" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {groupChoices.map(
                                                (group) => (
                                                    <SelectItem
                                                        key={group}
                                                        value={group}
                                                    >
                                                        {group}
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />

                            {errors.group && (
                                <p className="text-sm text-red-500">
                                    {errors.group.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Manzil</Label>

                            <Input
                                {...register("address")}
                                placeholder="Manzil"
                            />

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
                            <UserRound
                                size={16}
                                className="text-sky"
                            />
                            Otasi haqida ma'lumot
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">

                        <div className="space-y-2">
                            <Label>Otasining F.I.Sh</Label>

                            <Input
                                {...register("fatherName")}
                                placeholder="Otasining F.I.Sh"
                            />

                            {errors.fatherName && (
                                <p className="text-sm text-red-500">
                                    {errors.fatherName.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>
                                Otasining telefon raqami
                            </Label>

                            <Controller
                                name="fatherPhone"
                                control={control}
                                render={({ field }) => (
                                    <PhoneInput
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
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
                            <UserRound
                                size={16}
                                className="text-grass"
                            />
                            Onasi haqida ma'lumot
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">

                        <div className="space-y-2">
                            <Label>Onasining F.I.Sh</Label>

                            <Input
                                {...register("motherName")}
                                placeholder="Onasining F.I.Sh"
                            />

                            {errors.motherName && (
                                <p className="text-sm text-red-500">
                                    {errors.motherName.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>
                                Onasining telefon raqami
                            </Label>

                            <Controller
                                name="motherPhone"
                                control={control}
                                render={({ field }) => (
                                    <PhoneInput
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
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
                            <FileStack
                                size={16}
                                className="text-sun"
                            />
                            Hujjatlar
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">

                        <Controller
                            name="childPhoto"
                            control={control}
                            render={({ field }) => (
                                <FileUpload
                                    label="Bolaning rasmi"
                                    onChange={field.onChange}
                                    error={
                                        errors.childPhoto?.message
                                    }
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
                                    error={
                                        errors.birthCertificate?.message
                                    }
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
                                    error={
                                        errors.fatherPassport?.message
                                    }
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
                                    error={
                                        errors.motherPassport?.message
                                    }
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
                                    error={
                                        errors.contract?.message
                                    }
                                />
                            )}
                        />

                    </CardContent>
                </Card>

                {/* BUTTONS */}
                <div className="flex gap-3">

                    <Button
                        type="submit"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? (
                            <>
                                <Loader2
                                    size={16}
                                    className="mr-2 animate-spin"
                                />
                                Saqlanmoqda...
                            </>
                        ) : (
                            "Saqlash"
                        )}
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                            navigate("/children")
                        }
                        disabled={mutation.isPending}
                    >
                        Bekor qilish
                    </Button>

                </div>

            </form>
        </div>
    );
}

