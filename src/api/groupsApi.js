/*
 * =====================================================================
 * GROUPS API — "server/backend" qatlami
 * =====================================================================
 * Hozircha mock (sun'iy) API ishlatiladi: ma'lumot xotirada saqlanadi.
 *
 * HAQIQIY BACKEND ULANADIGAN KUN (faqat mana shu faylni o'zgartirasiz):
 *   import axiosInstance from "./axiosInstance";
 *
 *   export const getGroupsRequest = () =>
 *     axiosInstance.get("/groups").then((r) => r.data);
 *
 *   export const addGroupRequest = (data) =>
 *     axiosInstance.post("/groups", data).then((r) => r.data);
 *
 *   export const updateGroupRequest = (data) =>
 *     axiosInstance.put(`/groups/${data.id}`, data).then((r) => r.data);
 *
 *   export const deleteGroupRequest = (id) =>
 *     axiosInstance.delete(`/groups/${id}`).then((r) => r.data);
 *
 * Backend bu shaklni qaytarishi kerak:
 *   { id, name, teacher, ageRange, capacity, childrenCount }
 * Boshqa fayllar (Groups.jsx, GroupForm.jsx, GroupProfile.jsx, store) O'ZGARMAYDI.
 * =====================================================================
 */

import { mockGroups } from "@/pages/Groups/mockGroups";

let groupsList = mockGroups.map((g) => ({ ...g }));

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getGroupsRequest() {
    await wait(150);
    return groupsList.map((g) => ({ ...g }));
}

export async function addGroupRequest(data) {
    await wait(250);
    const newGroup = {
        id: Date.now(),
        childrenCount: 0,
        ...data,
    };
    groupsList = [newGroup, ...groupsList];
    return { ...newGroup };
}

export async function updateGroupRequest(data) {
    await wait(250);
    const index = groupsList.findIndex((g) => String(g.id) === String(data.id));
    if (index !== -1) {
        groupsList[index] = { ...groupsList[index], ...data };
        return { ...groupsList[index] };
    }
    return { ...data };
}

export async function deleteGroupRequest(id) {
    await wait(150);
    groupsList = groupsList.filter((g) => String(g.id) !== String(id));
    return { id };
}