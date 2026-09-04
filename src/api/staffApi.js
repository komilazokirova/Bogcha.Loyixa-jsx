/*
 * =====================================================================
 * STAFF API — "server/backend" qatlami
 * =====================================================================
 * Hozircha mock (sun'iy) API ishlatiladi: ma'lumot xotirada saqlanadi.
 *
 * HAQIQIY BACKEND ULANADIGAN KUN (faqat mana shu faylni o'zgartirasiz):
 *   import axiosInstance from "./axiosInstance";
 *
 *   export const getStaffRequest = () =>
 *     axiosInstance.get("/staff").then((r) => r.data);
 *
 *   export const addStaffRequest = (data) =>
 *     axiosInstance.post("/staff", data).then((r) => r.data);
 *
 *   export const updateStaffRequest = (data) =>
 *     axiosInstance.put(`/staff/${data.id}`, data).then((r) => r.data);
 *
 *   export const deleteStaffRequest = (id) =>
 *     axiosInstance.delete(`/staff/${id}`).then((r) => r.data);
 *
 * Backend bu shaklni qaytarishi kerak:
 *   { id, firstName, lastName, position, group, phone, status }
 * Boshqa fayllar (Staff.jsx, StaffForm.jsx, store) O'ZGARMAYDI.
 * =====================================================================
 */

import { mockStaff } from "@/pages/Staff/mockStaff";

// Backend xotirasini taglid qiladigan ro'yxat (real backend kelganda kerak bo'lmaydi).
let staffList = mockStaff.map((s) => ({ ...s }));
let idCounter = 1000;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getStaffRequest() {
    await wait(150);
    return staffList.map((s) => ({ ...s }));
}

export async function addStaffRequest(data) {
    await wait(250);
    const newStaff = { id: ++idCounter, status: "faol", ...data };
    staffList = [newStaff, ...staffList];
    return { ...newStaff };
}

export async function updateStaffRequest(data) {
    await wait(250);
    const index = staffList.findIndex((s) => String(s.id) === String(data.id));
    if (index !== -1) {
        staffList[index] = { ...staffList[index], ...data };
        return { ...staffList[index] };
    }
    return { ...data };
}

export async function updateStaffStatusRequest(id, status) {
    await wait(150);
    const staff = staffList.find((s) => String(s.id) === String(id));
    if (staff) staff.status = status;
    return staff ? { ...staff } : null;
}

export async function deleteStaffRequest(id) {
    await wait(150);
    staffList = staffList.filter((s) => String(s.id) !== String(id));
    return { id };
}