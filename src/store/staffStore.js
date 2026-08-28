import { create } from "zustand";
import { mockStaff } from "../pages/Staff/mockStaff";

const useStaffStore = create((set) => ({
    staff: mockStaff,

    addStaff: (newStaff) =>
        set((state) => ({
            staff: [
                {
                    id: Date.now(),
                    status: "faol",
                    ...newStaff,
                },
                ...state.staff,
            ],
        })),

    updateStatus: (id, newStatus) =>
        set((state) => ({
            staff: state.staff.map((s) =>
                s.id === id ? { ...s, status: newStatus } : s
            ),
        })),
}));

export default useStaffStore;