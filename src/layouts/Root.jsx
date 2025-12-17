import React, { useEffect } from "react";
import { Outlet, useLocation, Link } from "react-router";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import toast, { Toaster } from "react-hot-toast";
import Icon from "../components/utilities/Icon";
import { useAuth } from "../contexts/AuthContext";
import {
  FaHome,
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
  FaUserPlus,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { FaHandsHoldingCircle } from "react-icons/fa6";
import { BsFillCalendarEventFill } from "react-icons/bs";

export default function Root() {
  const location = useLocation();
  const { user, logOut } = useAuth();

  // Close drawer when route changes
  useEffect(() => {
    const drawer = document.getElementById("navbar-drawer");
    if (drawer) drawer.checked = false;
  }, [location]);

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error?.message || "Failed to logout");
    }
  };
  return (
    <div className="drawer">
      <input id="navbar-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </main>

        <Toaster position="bottom-center" />
        <Footer />
      </div>

      <div className="drawer-side z-40">
        <label htmlFor="navbar-drawer" className="drawer-overlay" />

        <ul className="menu bg-base-200 min-h-full w-72 p-2 space-y-1">
          <li className="flex items-center justify-center my-4 text-2xl font-bold">
            <Icon classes="w-18" />
            {import.meta.env.VITE_SITE_NAME}
          </li>
          <li>
            <Link to="/" className="rounded-lg flex items-center gap-1">
              <FaHome className="mb-0.5" size={18} />
              Home
            </Link>
          </li>

          <li>
            <Link to="/clubs" className="rounded-lg flex items-center gap-1">
              <FaHandsHoldingCircle size={16} />
              Clubs
            </Link>
          </li>

          <li>
            <Link to="/events" className="rounded-lg flex items-center gap-1">
              <BsFillCalendarEventFill className="mb-0.5" />
              Events
            </Link>
          </li>
          {user ? (
            <>
              <li className="">
                <Link
                  to="/dashboard"
                  className="rounded-lg flex items-center gap-0.5"
                >
                  <MdDashboard className="mb-0.5" size={16} />
                  Dashboard
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="rounded-lg flex items-center gap-1 text-error"
                >
                  <FaSignOutAlt size={18} />
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="">
                <Link
                  to="/login"
                  className="rounded-lg flex items-center gap-1"
                >
                  <FaSignInAlt size={16} className="mb-0.5" />
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="rounded-lg flex items-center gap-1"
                >
                  <FaUserPlus className="mb-0.5" size={18} />
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
