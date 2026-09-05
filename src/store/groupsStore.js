import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockGroups } from "../pages/Groups/mockGroups";

const useGroupsStore = create(
  persist(
    (set) => ({
      groups: mockGroups,

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