import { create } from "zustand";

export type ToastType = "success" | "failure";

export interface ToastData {
  isToastActive: boolean;
  text: string;
  subtext: string;
  type: ToastType;
  setIsToastActive: (open: boolean) => void;
  setText: (text: string) => void;
  setSubText: (subtext: string) => void;
  setType: (type: ToastType) => void;
  setToastState: (state: Partial<ToastData>) => void;
}

export const useToastStore = create<ToastData>((set) => ({
  isToastActive: false,
  text: "",
  subtext: "",
  type: "success",
  setIsToastActive: (open) => {
    set({ isToastActive: open });
    if (open) {
      setTimeout(() => set({ isToastActive: false }), 3000);
    }
  },
  setText: (text) => set({ text }),
  setSubText: (subtext) => set({ subtext }),
  setType: (type) => set({ type }),
  setToastState: (state) => {
    set(state);
    if (state.isToastActive) {
      setTimeout(() => set({ isToastActive: false }), 3000);
    }
  },
}));
