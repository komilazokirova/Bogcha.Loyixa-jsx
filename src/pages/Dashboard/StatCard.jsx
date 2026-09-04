import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function StatCard({ title, value, icon: Icon, color = "blue" }) {
    const colorClasses = {
        blue: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
        amber: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
        emerald: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        red: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400",
    };

    return (
        <Card>
            {/* items-center va text-center qo'shildi: hammasi qoq o'rtada turadi */}
            <CardContent className="flex flex-col items-center text-center p-6">
                
                {/* Sarlavha */}
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {title}
                </p>
                
                {/* Raqam */}
                <p className="text-3xl font-bold mt-2 mb-4 text-ink dark:text-gray-100">
                    {value}
                </p>
                
                {/* Rasm (Icon) */}
                <div
                    className={cn(
                        "w-12 h-12 rounded-lg flex items-center justify-center",
                        colorClasses[color]
                    )}
                >
                    <Icon size={24} />
                </div>
                
            </CardContent>
        </Card>
    );
}