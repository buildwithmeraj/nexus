import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate, useLocation } from "react-router";
import Loading from "../components/utilities/Loading";

const ClubManagerRoute = ({ children }) => {
  const { user, authLoading, role } = useAuth();
  const location = useLocation();

  if (authLoading) return <Loading />;

  if ((user && role === "clubManager") || role === "admin") {
    return children;
  }

  return (
    <Navigate
      to="/login"
      replace
      state={{
        from: location.pathname,
        message: "You must be a club manager to view this page.",
      }}
    />
  );
};

export default ClubManagerRoute;
