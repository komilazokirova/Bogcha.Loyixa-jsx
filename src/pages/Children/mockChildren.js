export const mockChildren = [
  {
    id: 1,
    firstName: "Ali",
    lastName: "Karimov",
    birthDate: "2020-03-15",
    groupId: 4, // B4
    paymentStatus: "to'langan",
  },
  {
    id: 2,
    firstName: "Malika",
    lastName: "Yusupova",
    birthDate: "2021-07-22",
    groupId: 3, // B3
    paymentStatus: "qarzdor",
  },
  {
    id: 3,
    firstName: "Sardor",
    lastName: "Rashidov",
    birthDate: "2019-11-05",
    groupId: 4, // B4
    paymentStatus: "to'langan",
  },
  {
    id: 4,
    firstName: "Dilnoza",
    lastName: "Abdullayeva",
    birthDate: "2022-01-30",
    groupId: 1, // B1
    paymentStatus: "qarzdor",
  },
  {
    id: 5,
    firstName: "Jasur",
    lastName: "Tashkentov",
    birthDate: "2020-09-10",
    groupId: 2, // B2
    paymentStatus: "to'langan",
  },
];

// Guruh tanlash uchun (forma va filtrlarda ishlatiladi)
export const groupOptions = ["Barchasi", "B1", "B2", "B3", "B4"];

// Guruh nomini ID orqali topish uchun yordamchi funksiya
// (bu yerda import qilib bo'lmaydi - aylanma bog'lanish (circular import)
// oldini olish uchun ID->nom xaritasi shu yerda takrorlanadi)
export const groupIdByName = {
  B1: 1,
  B2: 2,
  B3: 3,
  B4: 4,
};

export const groupColors = {
  B1: "bg-bubblegum/15 text-bubblegum border-bubblegum/30",
  B2: "bg-sun/15 text-amber-600 border-sun/30",
  B3: "bg-grass/15 text-emerald-700 border-grass/30",
  B4: "bg-sky/15 text-sky border-sky/30",
};