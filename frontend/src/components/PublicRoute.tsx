import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthProvider";

const PublicRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();


  return isAuthenticated ? <Navigate to="/home" /> : children;
};

export default PublicRoute;
