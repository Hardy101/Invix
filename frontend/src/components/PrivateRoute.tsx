import { Outlet, Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthProvider";
import LoadingComponent from "./loading";

const PrivateRoutes: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return <LoadingComponent />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
