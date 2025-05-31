import { create } from "zustand";

type DropdownState = {
  isDropdownActive: boolean;
  setIsDropdownActive: (open: boolean) => void;
};

export const useDropdownState = create<DropdownState>((set) => ({
  isDropdownActive: false,
  setIsDropdownActive: (open) => set({ isDropdownActive: open }),
}));
