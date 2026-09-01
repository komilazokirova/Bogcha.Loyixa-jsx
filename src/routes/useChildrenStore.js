import { create } from "zustand";
import axios from "axios";

const API_URL = "http://192.168.0.104:8081/api/children/list";

const useChildrenStore = create((set) => ({
  children: [],
  isLoading: false,
  error: null,

  // Fetch children from Backend API
  fetchChildren: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(API_URL);
      set({ children: response.data, isLoading: false });
    } catch (err) {
      console.error("Error fetching children:", err);
      set({ error: err.message, isLoading: false });
    }
  },

  // Yangi bola qo'shish
  addChild: (child) =>
    set((state) => ({
      children: [child, ...state.children],
    })),

  // Bolani o'chirish
  removeChild: (id) =>
    set((state) => ({
      children: state.children.filter((child) => child.id !== id),
    })),

  // Bolani yangilash
  updateChild: (id, updatedChild) =>
    set((state) => ({
      children: state.children.map((child) =>
        child.id === id ? { ...child, ...updatedChild } : child
      ),
    })),
}));

export default useChildrenStore;