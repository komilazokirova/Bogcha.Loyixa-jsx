import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (userData, token) => {
        set({ user: userData, token, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      setRole: (role) => {
        set((state) => {
          if (state.user) {
            return {
              user: {
                ...state.user,
                role,
                group: role === "teacher" ? (state.user.group || "B4") : null,
              },
            };
          }
          return state;
        });
      },
    }),
    {
      name: "auth-storage", // localStorage'dagi kalit nomi
    }
  )
);

export default useAuthStore;