import axios from "axios";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { url } from "../constants/variables";

interface UserInfo {
  id: number;
  name: string;
  email: string;
  role: string;
  plan: string;
  phone: string;
  location: string;
  created_at: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  user: UserInfo | null;
  login: () => void;
  logout: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await fetch(`${url}/auth/me`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Not authenticated");
      const response: UserInfo = await res.json();
      console.log("API Response:", response);
      setUser(response);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Auth check error:", error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async () => {
    setIsAuthenticated(true);
    await checkAuth();
  };

  const logout = async (): Promise<boolean> => {
    try {
      const response = await axios.post(
        `${url}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setIsAuthenticated(false);
        setUser(null);
        return true;
      } else {
        console.error("Logout failed, unexpected response", response.data);
        return false;
      }
    } catch (err) {
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
