import { create } from "zustand";
import { mockPayments } from "../pages/Payments/mockPayments";

const usePaymentsStore = create((set) => ({
    payments: mockPayments,

    updateStatus: (id, newStatus) =>
        set((state) => ({
            payments: state.payments.map((p) =>
                p.id === id
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
}));

export default usePaymentsStore;