// src/lib/roles.js
// =====================================================================
// ROLLAR VA RUXSATLAR — markaziy manba
// Butun ilovadagi rolga oid mantiq shu yerda. Menu va router shu faylga
// tayanadi. Kelajakda yangi rol yoki modul qo'shsangiz, faqat shu yerni
// o'zgartirasiz.
// =====================================================================

export const ROLES = {
  ADMIN: "admin",
  DIRECTOR: "director",
  TEACHER: "teacher",
};

// "Xodimlarni boshqaruvchi" rollar — barcha guruhlarni ko'ra oladi
export const MANAGEMENT_ROLES = [ROLES.ADMIN, ROLES.DIRECTOR];

// Modul -> shu modulga kirishi mumkin bo'lgan rollar
export const PERMISSIONS = {
  dashboard: [ROLES.ADMIN, ROLES.DIRECTOR, ROLES.TEACHER],
  children: [ROLES.ADMIN, ROLES.DIRECTOR, ROLES.TEACHER],
  // Qo'shish/tahrirlash/o'chirish faqat boshqaruvchilar uchun
  childrenWrite: [ROLES.ADMIN, ROLES.DIRECTOR],
  groups: [ROLES.ADMIN, ROLES.DIRECTOR],
  payments: [ROLES.ADMIN, ROLES.DIRECTOR],
  staff: [ROLES.ADMIN, ROLES.DIRECTOR],
  attendance: [ROLES.ADMIN, ROLES.DIRECTOR, ROLES.TEACHER],
  // Kelajakda: foydalanuvchi hisoblarini boshqarish faqat admin uchun
  users: [ROLES.ADMIN],
};

// Rol berilgan modulga kira oladimi?
export function canAccess(permission, role) {
  return (PERMISSIONS[permission] || []).includes(role);
}

// Rol "boshqaruvchi"mi (admin yoki direktor)?
export function isManagement(role) {
  return MANAGEMENT_ROLES.includes(role);
}