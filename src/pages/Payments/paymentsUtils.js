// Hozircha frontendda hisoblanadi, lekin backend tayyor bo'lganda
// bu funksiya ichi API chaqiruviga (masalan GET /api/payments/stats)
// almashtiriladi — Payments.jsx'ga tegilmaydi.
export function calculatePaymentStats(payments) {
    const totalCollected = payments
        .filter((p) => p.status === "to'langan")
        .reduce((sum, p) => sum + p.amount, 0);

    const totalPending = payments
        .filter((p) => p.status !== "to'langan")
        .reduce((sum, p) => sum + p.amount, 0);

    return { totalCollected, totalPending };
}