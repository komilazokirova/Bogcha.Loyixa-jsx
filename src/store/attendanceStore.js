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

      // Berilgan sana uchun backenddan kelgan { childId: status } obyektini
      // mavjud records bilan birlashtiradi (boshqa sanalarni o'chirmaydi)
      mergeDateRecords: (date, dateRecords) =>
        set((state) => {
          const merged = { ...state.records };
          Object.entries(dateRecords || {}).forEach(([childId, status]) => {
            merged[key(childId, date)] = status;
          });
          return { records: merged };
        }),
    }),
    {
      name: "attendance-storage",
      partialize: (state) => ({ records: state.records }),
    }
  )
);

export default useAttendanceStore;