import { create } from "zustand";
import { mockAttendance } from "../pages/Attendance/mockAttendance";

const key = (childId, date) => `${childId}_${date}`;

const useAttendanceStore = create((set, get) => ({
    records: mockAttendance, // { "childId_date": "keldi" | "kelmadi" }

    getStatus: (childId, date) => get().records[key(childId, date)] || "belgilanmagan",

    setStatus: (childId, date, status) =>
        set((state) => ({
            records: {
                ...state.records,
                [key(childId, date)]: status,
            },
        })),
}));

export default useAttendanceStore;