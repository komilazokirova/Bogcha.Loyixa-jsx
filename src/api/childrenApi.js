// src/api/childrenApi.js

// Hozircha backend bo'lmagani uchun
// mock (sun'iy) API bilan ishlaymiz.

import { mockChildren } from "@/pages/Children/mockChildren";

// Ro'yxatni "so'rash" — useQuery shu funksiyani chaqiradi
export async function getChildrenRequest() {
  // Server javobini simulyatsiya qilish
  await new Promise((resolve) => {
    setTimeout(resolve, 500);
  });

  // Hozircha mock ma'lumotni qaytaramiz.
  // Backend tayyor bo'lganda, bu yerda:
  // const { data } = await axiosInstance.get("/children");
  // return data;
  return mockChildren;
}

export async function addChildRequest(childData) {
  // Server javobini simulyatsiya qilish
  await new Promise((resolve) => {
    setTimeout(resolve, 800);
  });

  return {
    id: Date.now(),
    paymentStatus: "qarzdor",
    ...childData,
  };
}
export async function updateChildRequest(childData) {
  // Server javobini simulyatsiya qilish
  await new Promise((resolve) => {
    setTimeout(resolve, 800);
  });

  // Backend tayyor bo'lganda, bu yerda:
  // const { data } = await axiosInstance.put(`/children/${childData.id}`, childData);
  // return data;
  return childData;
}