import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockGroups } from "../pages/Groups/mockGroups";

const useGroupsStore = create(
  persist(
    (set) => ({
      groups: mockGroups,

      // Backenddan kelgan ro'yxat bilan to'liq sinxronlash (React Query natijasi)
      setGroups: (list) => set({ groups: list }),

      addGroup: (newGroup) =>
        set((state) => ({
          groups: [
            {
              id: Date.now(),
              childrenCount: 0,
              ...newGroup,
            },
            ...state.groups,
          ],
        })),
    }),
    {
      name: "groups-storage",
      partialize: (state) => ({ groups: state.groups }),
    }
  )
);

export default useGroupsStore;