import { create } from "zustand";
import mockChildren from "../pages/Children/mockChildren";

const useChildrenStore = create((set) => ({
  children: mockChildren,

  isLoading: false,
  error: null,

  // Yangi bola qo'shish
  addChild: (child) =>
    set((state) => ({
      children: [child, ...state.children],
    })),

  // Bolani o'chirish
  removeChild: (id) =>
    set((state) => ({
      children: state.children.filter(
        (child) => String(child.id) !== String(id)
      ),
    })),

  // Bolani yangilash
  updateChild: (id, updatedChild) =>
    set((state) => ({
      children: state.children.map((child) =>
        String(child.id) === String(id)
          ? { ...child, ...updatedChild }
          : child
      ),
    })),
}));

export default useChildrenStore;