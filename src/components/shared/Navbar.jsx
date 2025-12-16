import React from "react";
import { Link, useLocation } from "react-router";
import {
  FaUser,
  FaSignOutAlt,
  FaCog,
  FaHome,
  FaUsers,
  FaCalendar,
  FaBars,
} from "react-icons/fa";
import Logo from "../utilities/Logo";
import ThemeSwitcher from "../utilities/ThemeSwitcher";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logOut, authLoading, role } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error?.message || "Failed to logout");
    }
  };

  const isActive = (path) => location.pathname === path;
  const isDashboard = location.pathname.includes("/dashboard");

  // Navigation items
  const navItems = [
    { label: "Home", href: "/", icon: FaHome },
    { label: "Clubs", href: "/clubs", icon: FaUsers },
    { label: "Events", href: "/events", icon: FaCalendar },
  ];

  return (
    <div className="navbar bg-base-100 shadow-sm px-4">
      <div className="flex-none lg:hidden">
        <label
          htmlFor={isDashboard ? "dashboard-drawer" : "navbar-drawer"}
          aria-label="open sidebar"
          className="btn btn-square btn-ghost"
        >
          <FaBars size={20} />
        </label>
      </div>

      <div className="flex-1">
        <Link to="/" className="text-xl">
          <Logo />
        </Link>
      </div>

      <div className="hidden flex-none lg:block">
        <ul className="menu menu-horizontal px-1 space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={`flex items-center gap-2 ${
                    isActive(item.href) ? "font-extrabold text-primary" : ""
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex items-center gap-2">
        <div className="dropdown dropdown-end">
          <label
            tabIndex={0}
            className="btn btn-ghost btn-circle avatar placeholder"
            title={user?.displayName || "User"}
          >
            {authLoading ? (
              <span className="loading loading-spinner loading-sm text-primary" />
            ) : user ? (
              <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-full w-10 flex items-center justify-center font-bold text-sm">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <span>{user.displayName?.charAt(0) || "U"}</span>
                )}
              </div>
            ) : (
              <FaUser size={20} />
            )}
          </label>

          <ul
            tabIndex={0}
            className="dropdown-content menu p-3 shadow bg-base-100 rounded-box w-56 z-50"
          >
            {authLoading ? (
              <li className="flex justify-center py-2">
                <span className="loading loading-spinner loading-sm text-primary" />
              </li>
            ) : user ? (
              <>
                <li className="px-4 py-1 text-xs text-base-content/60">
                  {user.displayName}
                </li>

                <li className="menu-title disabled">
                  <span className="text-xs text-gray-500">{user.email}</span>
                </li>
                <li className="menu-title disabled">
                  <span className="badge badge-sm badge-primary capitalize">
                    {role || "member"}
                  </span>
                </li>

                <li className="my-1">
                  <hr />
                </li>

                <li>
                  <Link to="/dashboard" className="flex items-center gap-2">
                    <FaHome size={16} />
                    Dashboard
                  </Link>
                </li>

                {role === "member" && (
                  <li>
                    <Link
                      to="/apply-for-club-manager"
                      className="flex items-center gap-2"
                    >
                      <FaCog size={16} />
                      Apply for Manager
                    </Link>
                  </li>
                )}

                <li className="my-1">
                  <hr />
                </li>

                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <FaSignOutAlt size={16} />
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="flex items-center gap-2">
                    <FaUser size={16} />
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="flex items-center gap-2">
                    <FaUser size={16} />
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        <ThemeSwitcher />
      </div>
    </div>
  );
};

export default Navbar;
