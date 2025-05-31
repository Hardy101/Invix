import { create } from "zustand";
import { Guest } from "../constants/interfaces";

interface GuestStore {
  guest: Guest;
  setGuest: (guest: Guest) => void;
}

const initialGuest: Guest = {
  name: "",
  tags: "",
  email: "",
  errors: "",
};

export const useGuestStore = create<GuestStore>((set) => ({
  guest: initialGuest,
  setGuest: (guest) => set({ guest }),
}));
