import { Users, UsersRound, Wallet, AlertCircle } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import StatCard from "./StatCard";

// TODO: Backend tayyor bo'lgach, bu mock ma'lumotlar o'rniga
// TanStack Query orqali /dashboard/stats va /dashboard/payments-chart dan olinadi
const mockStats = {
  totalChildren: 100,
  totalGroups: 4,
  paymentRate: 82,
  debtors: 18,
};

const mockChartData = [
  { month: "Mart", tolov: 68 },
  { month: "Aprel", tolov: 74 },
  { month: "May", tolov: 71 },
  { month: "Iyun", tolov: 80 },
  { month: "Iyul", tolov: 76 },
  { month: "Avgust", tolov: 82 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500 text-sm">Umumiy statistika</p>
      </div>

      {/* Statistika kartalari */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Jami bolalar"
          value={mockStats.totalChildren}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Guruhlar soni"
          value={mockStats.totalGroups}
          icon={UsersRound}
          color="emerald"
        />
        <StatCard
          title="To'lov foizi"
          value={`${mockStats.paymentRate}%`}
          icon={Wallet}
          color="amber"
        />
        <StatCard
          title="Qarzdorlar"
          value={mockStats.debtors}
          icon={AlertCircle}
          color="red"
        />
      </div>

      {/* Grafik */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Oylik to'lov dinamikasi (%)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={mockChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="tolov"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}