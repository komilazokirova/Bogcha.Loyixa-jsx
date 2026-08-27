import { create } from "zustand";
import { mockChildren } from "../pages/Children/mockChildren";

const useChildrenStore = create((set) => ({
    children: mockChildren,

    addChild: (newChild) =>
        set((state) => ({
            children: [
                {
                    id: Date.now(),
                    paymentStatus: "qarzdor",
                    ...newChild,
                },
                ...state.children,
            ],
        })),
}));

export default useChildrenStore;