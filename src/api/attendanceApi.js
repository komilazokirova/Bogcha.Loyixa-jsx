/*
 * =====================================================================
 * ATTENDANCE API — "server/backend" qatlami
 * =====================================================================
 * Hozircha mock (sun'iy) API ishlatiladi: ma'lumot xotirada saqlanadi.
 *
 * HAQIQIY BACKEND ULANADIGAN KUN (faqat mana shu faylni o'zgartirasiz):
 *   import axiosInstance from "./axiosInstance";
 *
 *   export const getAttendanceRequest = (date) =>
 *     axiosInstance.get("/attendance", { params: { date } }).then((r) => r.data);
 *
 *   export const setAttendanceRequest = (childId, date, status) =>
 *     axiosInstance.post("/attendance", { childId, date, status }).then((r) => r.data);
 *
 * Backend "getAttendanceRequest" uchun bu shaklni qaytarishi tavsiya etiladi:
 *   { "<childId>": "keldi" | "kelmadi", ... }   // faqat so'ralgan sana uchun
 *
 * Boshqa fayllar (Attendance.jsx, store) O'ZGARMAYDI.
 * =====================================================================
 */

let attendanceRecords = {};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const key = (childId, date) => `${childId}_${date}`;

export async function getAttendanceRequest(date) {
    await wait(150);
    const result = {};
    Object.entries(attendanceRecords).forEach(([k, status]) => {
        if (k.endsWith(`_${date}`)) {
            const childId = k.slice(0, k.length - date.length - 1);
            result[childId] = status;
        }
    });
    return result;
}

export async function setAttendanceRequest(childId, date, status) {
    await wait(150);
    attendanceRecords[key(childId, date)] = status;
    return { childId, date, status };
}