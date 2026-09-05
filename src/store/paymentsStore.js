import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockPayments } from "../pages/Payments/mockPayments";

const usePaymentsStore = create(
  persist(
    (set) => ({
      payments: mockPayments,

      updateStatus: (id, newStatus) =>
        set((state) => ({
          payments: state.payments.map((p) =>
            String(p.id) === String(id)
              ? {
                  ...p,
                  status: newStatus,
                  date:
                    newStatus === "to'langan"
                      ? new Date().toISOString().slice(0, 10)
                      : "-",
                }
              : p
          ),
        })),
    }),
    {
      name: "payments-storage",
      partialize: (state) => ({ payments: state.payments }),
    }
  )
);

export default usePaymentsStore;