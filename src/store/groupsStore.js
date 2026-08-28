import { create } from "zustand";
import { mockGroups } from "../pages/Groups/mockGroups";

const useGroupsStore = create((set) => ({
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
}));

export default useGroupsStore;