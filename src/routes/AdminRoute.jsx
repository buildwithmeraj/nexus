import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate, useLocation } from "react-router";
import Loading from "../components/utilities/Loading";
import useAxiosSecureInstance from "../hooks/useSecureAxiosInstance";

const AdminRoute = ({ children }) => {
  const { user, authLoading } = useAuth();
  const location = useLocation();
  const axiosSecure = useAxiosSecureInstance();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);

  useEffect(() => {
    if (user && user.email) {
      axiosSecure
        .get(`/users/role/${user?.email}`)
        .then((response) => {
          if (response.data.role === "admin") {
            setIsAdmin(true);
          }
        })
        .catch((error) => {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
        })
        .finally(() => {
          setAdminLoading(false);
        });
    } else {
      setAdminLoading(false);
    }
  }, [user, axiosSecure]);

  if (authLoading || adminLoading) return <Loading />;

  if (user && user.email && isAdmin) {
    return children;
  }

  return (
    <Navigate
      to="/login"
      replace
      state={{
        from: location.pathname,
        message: "You must be an admin to view this page.",
      }}
    />
  );
};

export default AdminRoute;
