import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockStaff } from "../pages/Staff/mockStaff";

const useStaffStore = create(
  persist(
    (set) => ({
      staff: mockStaff.map((s) => ({ ...s })),

      setStaff: (list) => set({ staff: list }),

      // ID endi mavjud ro'yxatdagi eng katta ID + 1 bo'ladi.
      // Sababi: sahifa yangilaganda hisoblagich qayta noldan boshlansa,
      // saqlangan ID bilan to'qnashib ketmasligi uchun.
      addStaff: (data) =>
        set((state) => {
          const maxId = state.staff.reduce(
            (m, s) => Math.max(m, Number(s.id) || 0),
            0
          );
          return {
            staff: [{ id: maxId + 1, status: "faol", ...data }, ...state.staff],
          };
        }),

      updateStaff: (data) =>
        set((state) => ({
          staff: state.staff.map((s) =>
            String(s.id) === String(data.id) ? { ...s, ...data } : s
          ),
        })),

      updateStatus: (id, status) =>
        set((state) => ({
          staff: state.staff.map((s) =>
            String(s.id) === String(id) ? { ...s, status } : s
          ),
        })),

      deleteStaff: (id) =>
        set((state) => ({
          staff: state.staff.filter((s) => String(s.id) !== String(id)),
        })),
    }),
    {
      name: "staff-storage",
      partialize: (state) => ({ staff: state.staff }),
    }
  )
);

export default useStaffStore;