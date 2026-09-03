// src/api/childrenApi.js

// Hozircha backend bo'lmagani uchun
// mock (sun'iy) API bilan ishlaymiz.
import { mockChildren } from "@/pages/Children/mockChildren";

export async function getChildrenRequest() {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockChildren;
}

export async function addChildRequest(childData) {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const newChild = {
    id: Date.now(),
    paymentStatus: "qarzdor",
    ...childData,
  };

  // 1-O'ZGARISH: Yangi bolani ro'yxatning eng boshiga qo'shamiz (unshift)
  mockChildren.unshift(newChild);

  return newChild;
}

export async function updateChildRequest(childData) {
  await new Promise((resolve) => setTimeout(resolve, 800));

  // 2-O'ZGARISH: Tahrirlanganda eski ma'lumotni yangisiga almashtiramiz
  const index = mockChildren.findIndex(c => String(c.id) === String(childData.id));
  if (index !== -1) {
    mockChildren[index] = childData;
  }

  return childData;
}

export async function deleteChildRequest(id) {
  await new Promise((resolve) => setTimeout(resolve, 600));

  // 3-O'ZGARISH: O'chirilganda ro'yxatdan olib tashlaymiz
  const index = mockChildren.findIndex(c => String(c.id) === String(id));
  if (index !== -1) {
    mockChildren.splice(index, 1);
  }

  return { id };
}