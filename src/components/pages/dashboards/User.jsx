import React from "react";
import { Link } from "react-router";
import { useAuth } from "../../../contexts/AuthContext";
import { LogOut } from "lucide-react";
import { HiUserCircle } from "react-icons/hi";
import toast from "react-hot-toast";

const UserDashboard = () => {
  const { user, logOut, role } = useAuth();
  const handleLogout = () => {
    toast.success("Logged out successfully");
    logOut();
  };

  return (
    <div className="flex flex-col items-center gap-8 p-6">
      <title>Dashboard - {import.meta.env.VITE_SITE_NAME}</title>
      <div className="w-full max-w-md bg-base-100 border border-base-300 rounded-2xl shadow-md p-6 text-center">
        <h1 className="mb-4">Profile</h1>

        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-primary shadow-md mx-auto"
            referrerPolicy="no-referrer"
          />
        ) : (
          <HiUserCircle className="text-8xl text-primary/70 mx-auto" />
        )}

        <h5 className="mt-3 text-lg font-semibold text-base-content">
          {user?.displayName || "User"}
        </h5>
        <p className="text-sm ">{user?.email || "N/A"}</p>

        <button
          onClick={handleLogout}
          className="btn btn-error mt-5 text-white w-full flex items-center justify-center gap-2"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
      {role === "member" && (
        <Link to="/apply-for-club-manager" className="btn btn-primary">
          Apply for Club Manager
        </Link>
      )}
    </div>
  );
};

export default UserDashboard;
