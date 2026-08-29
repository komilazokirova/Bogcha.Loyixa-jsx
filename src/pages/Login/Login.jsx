import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginSchema } from "./loginSchema";
import useAuthStore from "../../store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function Login() {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState("admin");

    const [teacherGroup, setTeacherGroup] = useState("Katta");
    const [displayName, setDisplayName] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data) => {
        setServerError("");
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 800));
            const roleNames = {
                admin: "Admin",
                director: "Direktor",
                teacher: "Tarbiyachi",
            };
            const mockUser = {
                name: displayName || roleNames[role],
                role,
                group: role === "teacher" ? teacherGroup : null,
            };
            const mockToken = "test-token-12345";
            login(mockUser, mockToken);
            navigate("/dashboard");
        } catch (err) {
            setServerError("Email yoki parol noto'g'ri");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex items-center justify-center h-screen overflow-hidden bg-gradient-to-b from-sky/20 via-cream to-sun/10">
            {/* Suzib yuruvchi shakllar */}
            <div className="absolute top-16 left-12 w-24 h-24 rounded-full bg-bubblegum/30 animate-float" />
            <div className="absolute bottom-24 right-16 w-32 h-32 rounded-full bg-sky/30 animate-float-slower" />
            <div className="absolute top-32 right-24 w-16 h-16 rounded-full bg-sun/40 animate-float" />
            <div className="absolute bottom-40 left-24 w-20 h-20 rounded-full bg-grass/30 animate-float-slower" />

            {/* Sharlar (balloon) illyustratsiya */}
            <svg
                className="absolute top-8 right-1/4 w-14 animate-float"
                viewBox="0 0 40 60"
                fill="none"
            >
                <ellipse cx="20" cy="20" rx="18" ry="20" fill="#FF7AA8" />
                <line x1="20" y1="40" x2="20" y2="58" stroke="#2D2A32" strokeWidth="1.5" />
            </svg>
            <svg
                className="absolute bottom-16 left-1/4 w-10 animate-float-slower"
                viewBox="0 0 40 60"
                fill="none"
            >
                <ellipse cx="20" cy="20" rx="16" ry="18" fill="#FDBA31" />
                <line x1="20" y1="38" x2="20" y2="56" stroke="#2D2A32" strokeWidth="1.5" />
            </svg>

            <Card className="w-full max-w-sm relative z-10 border-2 border-sky/20 shadow-xl rounded-3xl">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto mb-2 w-16 h-16 rounded-full bg-sun/20 flex items-center justify-center text-3xl">
                        🌈
                    </div>
                    <CardTitle className="font-display text-2xl text-sky">
                        Bog'cha CRM
                    </CardTitle>
                    <p className="text-sm text-gray-500">Tizimga xush kelibsiz!</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="email@misol.com"
                                className="rounded-xl"
                                {...register("email")}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Parol</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className="rounded-xl"
                                {...register("password")}
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Ismingiz (test uchun)</Label>
                            <Input
                                placeholder="Masalan: Nodira"
                                className="rounded-xl"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Rol (test uchun)</Label>
                            <Select value={role} onValueChange={setRole}>
                                <SelectTrigger className="w-full rounded-xl">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="director">Direktor</SelectItem>
                                    <SelectItem value="teacher">Tarbiyachi</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {role === "teacher" && (
                            <div className="space-y-2">
                                <Label>Guruhingiz (test uchun)</Label>
                                <Select value={teacherGroup} onValueChange={setTeacherGroup}>
                                    <SelectTrigger className="w-full rounded-xl">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Yasli">Yasli</SelectItem>
                                        <SelectItem value="Kichik">Kichik</SelectItem>
                                        <SelectItem value="O'rta">O'rta</SelectItem>
                                        <SelectItem value="Katta">Katta</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {serverError && (
                            <p className="text-sm text-red-500 text-center">{serverError}</p>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-sky hover:bg-sky/90 font-display text-base h-11 transition-transform active:scale-95"
                        >
                            {loading ? "Kirilmoqda..." : "Kirish"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}