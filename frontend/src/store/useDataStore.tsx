import { create } from "zustand";

interface UserData {
  name: string;
  email: string;
  plan: string;
}

interface Store {
  user: UserData | null;
  setUser: (userData: UserData) => void;
  logout: () => void;
}

const useDataStore = create<Store>((set) => ({
  user: null,
  setUser: (userData) => set({ user: userData }),
  logout: () => set({ user: null }),
}));

export default useDataStore;
