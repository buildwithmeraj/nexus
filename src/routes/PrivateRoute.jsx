import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate, useLocation } from "react-router";
import Loading from "../components/utilities/Loading";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loading />;

  if (user && user.email) return children;

  return (
    <Navigate
      to="/login"
      replace
      state={{
        from: location.pathname,
        message: "You must login to view this page.",
      }}
    />
  );
};

export default PrivateRoute;
