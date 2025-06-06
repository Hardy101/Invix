import axios from "axios";
import { url } from "../constants/variables";

export interface Guest {
  name: string;
  email: string;
  status: string;
  checkInTime?: string;
  qr_token: string;
  tags?: string[];
  event?: {
    id: number;
    name: string;
    date: string;
    location: string;
  };
  lastActivity?: string;
}

export interface EventStats {
  totalGuests: number;
  checkedIn: number;
  pending: number;
  checkInRate: number;
}

export interface RecentCheckIn {
  id: number;
  name: string;
  time: string;
  ticketType: string;
  status: string;
}

const api = {
  // Get guest by QR code
  getGuestByQR: async (uuid: string): Promise<Guest> => {
    // The backend returns a message with the guest's name
    // We need to fetch the full guest data
    const guestResponse = await axios.get(`${url}/event/readqrcode/${uuid}`, {
      withCredentials: true,
    });

    return guestResponse.data;
  },

  // Check in guest
  checkInGuest: async (uuid: string): Promise<{ message: string }> => {
    const response = await axios.post(
      `${url}/event/check-in/${uuid}`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  },

  // Check out guest
  checkOutGuest: async (uuid: string): Promise<{ message: string }> => {
    const response = await axios.post(
      `${url}/event/check-out/${uuid}`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  },

  // Get event analytics
  getEventAnalytics: async (eventId: number): Promise<EventStats> => {
    const response = await axios.get(`${url}/event/${eventId}/analytics`, {
      withCredentials: true,
    });
    return response.data;
  },

  // Search guest
  searchGuest: async (query: string): Promise<Guest[]> => {
    const response = await axios.get(
      `${url}/event/search-guest?query=${query}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  },
};

export default api;
