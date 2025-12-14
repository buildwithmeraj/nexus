import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import Loading from "../components/utilities/Loading";

const PrivateRoute = () => {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // IMPORTANT: Return Outlet, not children
  return <Outlet />;
};

export default PrivateRoute;
