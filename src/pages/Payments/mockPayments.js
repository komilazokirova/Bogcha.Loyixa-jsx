export const mockPayments = [
    { id: 1, childId: 1, childName: "Ali Karimov", group: "Katta", amount: 850000, month: "Avgust 2026", status: "to'langan", date: "2026-08-05" },
    { id: 2, childId: 2, childName: "Malika Yusupova", group: "O'rta", amount: 750000, month: "Avgust 2026", status: "kutilmoqda", date: "-" },
    { id: 3, childId: 3, childName: "Sardor Rashidov", group: "Katta", amount: 850000, month: "Avgust 2026", status: "to'langan", date: "2026-08-03" },
    { id: 4, childId: 4, childName: "Dilnoza Abdullayeva", group: "Yasli", amount: 900000, month: "Avgust 2026", status: "muddati o'tgan", date: "-" },
    { id: 5, childId: 5, childName: "Jasur Tashkentov", group: "Kichik", amount: 800000, month: "Avgust 2026", status: "to'langan", date: "2026-08-07" },
];

export const paymentStatusOptions = ["Barchasi", "to'langan", "kutilmoqda", "muddati o'tgan"];

export const paymentStatusColors = {
    "to'langan": "default",
    "kutilmoqda": "secondary",
    "muddati o'tgan": "destructive",
};