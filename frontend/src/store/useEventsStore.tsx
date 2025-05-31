// store for saving events of authenticated user
import { create } from "zustand";
import axios from "axios";

import { url } from "../constants/variables";

interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  expected_guests: number;
}

interface EventStore {
  events: Event[];
  clearEvents: () => void;
  isLoading: boolean;
  error: string | null;
  fetchEvents: () => void;
}

export const useEventStore = create<EventStore>((set) => ({
  events: [],
  clearEvents: () => set({ events: [] }),
  isLoading: false,
  error: null,
  fetchEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${url}/event/events`, {
        withCredentials: true,
      });
      set({ events: response.data, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch events", isLoading: false });
    }
  },
}));
