/*
 * =====================================================================
 * PAYMENTS API — "server/backend" qatlami
 * =====================================================================
 * Hozircha mock (sun'iy) API ishlatiladi: ma'lumot xotirada saqlanadi.
 *
 * HAQIQIY BACKEND ULANADIGAN KUN (faqat mana shu faylni o'zgartirasiz):
 *   import axiosInstance from "./axiosInstance";
 *
 *   export const getPaymentsRequest = () =>
 *     axiosInstance.get("/payments").then((r) => r.data);
 *
 *   export const updatePaymentStatusRequest = (id, status) =>
 *     axiosInstance.patch(`/payments/${id}/status`, { status }).then((r) => r.data);
 *
 * Backend bu shaklni qaytarishi kerak:
 *   { id, childId, childName, group, amount, month, status, date }
 * Boshqa fayllar (Payments.jsx, store) O'ZGARMAYDI.
 * =====================================================================
 */

import { mockPayments } from "@/pages/Payments/mockPayments";

let paymentsList = mockPayments.map((p) => ({ ...p }));

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getPaymentsRequest() {
    await wait(150);
    return paymentsList.map((p) => ({ ...p }));
}

export async function updatePaymentStatusRequest(id, status) {
    await wait(200);
    const index = paymentsList.findIndex((p) => String(p.id) === String(id));
    if (index !== -1) {
        paymentsList[index] = {
            ...paymentsList[index],
            status,
            date:
                status === "to'langan"
                    ? new Date().toISOString().slice(0, 10)
                    : "-",
        };
        return { ...paymentsList[index] };
    }
    return null;
}