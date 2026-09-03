import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockChildren } from "../pages/Children/mockChildren";

const useChildrenStore = create(
    persist(
        (set) => ({
            children: mockChildren,

            addChild: (newChild) =>
                set((state) => ({
                    children: [newChild, ...state.children],
                })),

            addChildOptimistic: (tempChild) =>
                set((state) => ({
                    children: [tempChild, ...state.children],
                })),

            addChildOptimistic: (tempChild) =>
                set((state) => ({
                    children: [tempChild, ...state.children],
                })),
            // Bolani ro'yxatga qo'shish (tahrirlashda ishlatilmaydi)
            addChild: (newChild) =>
                set((state) => ({
                    children: [newChild, ...state.children],
                })),

            replaceChild: (tempId, realChild) =>
                set((state) => ({
                    children: state.children.map((c) => (c.id === tempId ? realChild : c)),
                })),

            removeChild: (tempId) =>
                set((state) => ({
                    children: state.children.filter((c) => c.id !== tempId),
                })),

            // Tahrirlash: optimistik yangilash
            updateChildOptimistic: (id, updatedData) =>
                set((state) => ({
                    children: state.children.map((c) =>
                        String(c.id) === String(id) ? { ...c, ...updatedData } : c
                    ),
                })),

            // O'chirish: optimistik o'chirish, lekin eski ma'lumotni saqlab qolamiz (rollback uchun)
            deleteChildOptimistic: (id) =>
                set((state) => ({
                    children: state.children.filter((c) => String(c.id) !== String(id)),
                })),

            // Agar o'chirish xato bo'lsa, orqaga qaytarish
            restoreChild: (deletedChild, originalIndex) =>
                set((state) => {
                    const newChildren = [...state.children];
                    newChildren.splice(originalIndex, 0, deletedChild);
                    return { children: newChildren };
                }),
        }),
        {
            name: "children-storage", // localStorage'dagi kalit nomi
        }
    )
);

export default useChildrenStore;