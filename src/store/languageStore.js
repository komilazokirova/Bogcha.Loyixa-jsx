import { create } from "zustand";
import { persist } from "zustand/middleware";

const useLanguageStore = create(
  persist(
    (set) => ({
      language: "uz",
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: "language-storage", // localStorage'dagi kalit nomi
    }
  )
);

export default useLanguageStore;