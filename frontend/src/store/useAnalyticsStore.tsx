import { create } from "zustand";
import axios from "axios";
import { url } from "../constants/variables";

interface CheckInData {
  time: string;
  checkins: number;
}

interface AnalyticsData {
  checkedIn: number;
  checkedOut: number;
  pending: number;
  checkInTimes: CheckInData[];
}

interface AnalyticsStore {
  analytics: AnalyticsData;
  isLoading: boolean;
  error: string | null;
  fetchAnalytics: (eventId: string) => Promise<void>;
}

const initialAnalytics: AnalyticsData = {
  checkedIn: 0,
  checkedOut: 0,
  pending: 0,
  checkInTimes: [],
};

export const useAnalyticsStore = create<AnalyticsStore>((set) => ({
  analytics: initialAnalytics,
  isLoading: false,
  error: null,
  fetchAnalytics: async (eventId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${url}/event/${eventId}/analytics`, {
        withCredentials: true,
      });

      // Transform the response data into the format we need
      const checkInTimes = response.data.checkInTimes.map((item: any) => ({
        time: item.hour,
        checkins: item.count,
      }));

      set({
        analytics: {
          checkedIn: response.data.checkedIn,
          checkedOut: response.data.checkedOut,
          pending: response.data.pending,
          checkInTimes,
        },
        isLoading: false,
      });
    } catch (error) {
      set({ error: "Failed to fetch analytics data", isLoading: false });
    }
  },
}));
