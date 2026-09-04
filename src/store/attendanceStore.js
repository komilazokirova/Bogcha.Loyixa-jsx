import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockAttendance } from "../pages/Attendance/mockAttendance";

const key = (childId, date) => `${childId}_${date}`;

const useAttendanceStore = create(
  persist(
    (set, get) => ({
      records: mockAttendance,

      getStatus: (childId, date) =>
        get().records[key(childId, date)] || "belgilanmagan",

      setStatus: (childId, date, status) =>
        set((state) => ({
          records: {
            ...state.records,
            [key(childId, date)]: status,
          },
        })),
    }),
    {
      name: "attendance-storage",
      // Faqat records ma'lumotini saqlaymiz (getStatus/setStatus funksiyalar emas)
      partialize: (state) => ({ records: state.records }),
    }
  )
);

export default useAttendanceStore;