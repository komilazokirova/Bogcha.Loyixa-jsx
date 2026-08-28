
import { create } from "zustand";
import { mockChildren } from "../pages/Children/mockChildren";

const useChildrenStore = create((set) => ({
    children: mockChildren,

    // Yangi bola qo'shish
    addChild: (child) =>
        set((state) => ({
            children: [child, ...state.children],
        })),

    // Bolani o'chirish
    removeChild: (id) =>
        set((state) => ({
            children: state.children.filter(
                (child) => child.id !== id
            ),
        })),

    // Bolani yangilash
    updateChild: (id, updatedChild) =>
        set((state) => ({
            children: state.children.map((child) =>
                child.id === id
                    ? { ...child, ...updatedChild }
                    : child
            ),
        })),
}));

export default useChildrenStore;

