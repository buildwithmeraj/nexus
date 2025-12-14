import { Outlet, useLocation, useNavigate, Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import Footer from "../components/shared/Footer";
import Navbar from "../components/shared/Navbar";
import React from "react";
import {
  FaHome,
  FaUsers,
  FaClipboardList,
  FaCalendar,
  FaSignOutAlt,
  FaCog,
  FaChartBar,
} from "react-icons/fa";

export default function Sidebar() {
  const { user, logOut, role } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const userRole = role || "member";

  // Close drawer when route changes
  React.useEffect(() => {
    const drawer = document.getElementById("dashboard-drawer");
    if (drawer) {
      drawer.checked = false;
    }
  }, [location]);

  const allMenus = {
    admin: [
      { label: "Dashboard", to: "/dashboard/admin", icon: FaHome },
      { label: "Users", to: "/dashboard/admin/users", icon: FaUsers },
      { label: "Clubs", to: "/dashboard/admin/clubs", icon: FaClipboardList },
      { label: "Payments", to: "/dashboard/admin/payments", icon: FaChartBar },
    ],
    clubManager: [
      { label: "Dashboard", to: "/dashboard/club-manager", icon: FaHome },
      {
        label: "My Clubs",
        to: "/dashboard/club-manager/clubs",
        icon: FaClipboardList,
      },
      {
        label: "Events",
        to: "/dashboard/club-manager/events",
        icon: FaCalendar,
      },
      {
        label: "Add Club",
        to: "/dashboard/club-manager/add-club",
        icon: FaCog,
      },
    ],
    member: [
      { label: "Dashboard", to: "/dashboard/member", icon: FaHome },
      {
        label: "My Clubs",
        to: "/dashboard/member/clubs",
        icon: FaClipboardList,
      },
      { label: "My Events", to: "/dashboard/member/events", icon: FaCalendar },
      {
        label: "Apply for Club Manager",
        to: "/dashboard/member/apply-for-club-manager",
        icon: FaUsers,
      },
    ],
  };

  const getMenuItems = () => {
    if (userRole === "admin") {
      return allMenus.admin;
    } else if (userRole === "clubManager") {
      return allMenus.clubManager;
    } else {
      return allMenus.member;
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed");
      console.error(error);
    }
  };

  const isActive = (path) => location.pathname === path;
  const currentMenus = getMenuItems();

  return (
    <div className="drawer lg:drawer-open">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* DRAWER CONTENT */}
      <div className="drawer-content flex flex-col min-h-screen">
        {/* Navbar */}
        <Navbar />

        {/* Main Content - OUTLET RENDERS HERE */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 container mx-auto max-w-7xl w-full">
          <Outlet />
        </main>

        {/* Toast */}
        <Toaster position="bottom-center" reverseOrder={false} />

        {/* Footer */}
        <Footer />
      </div>

      {/* DRAWER SIDEBAR */}
      <div className="drawer-side z-40">
        <label
          htmlFor="dashboard-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        <ul className="menu bg-base-200 min-h-full w-80 p-4 space-y-2 overflow-y-auto">
          {/* User Info Section */}
          {user && (
            <>
              <li className="menu-title disabled">
                <div className="flex items-center gap-3">
                  <div className="avatar placeholder">
                    <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-full w-12 flex items-center justify-center font-bold">
                      {user?.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.displayName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <span>{user?.displayName?.charAt(0) || "U"}</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{user?.displayName}</p>
                    <span className="badge badge-sm badge-primary capitalize">
                      {userRole}
                    </span>
                  </div>
                </div>
              </li>

              <li>
                <hr />
              </li>

              {/* Navigation Menu Items */}
              {currentMenus.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                        isActive(item.to)
                          ? "bg-primary text-white font-semibold shadow-md"
                          : "text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      <Icon size={18} className="flex-shrink-0" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}

              <li className="my-2">
                <hr />
              </li>

              <li>
                <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-300 transition">
                  <FaCog size={18} className="flex-shrink-0" />
                  <span className="text-sm font-medium">Settings</span>
                </button>
              </li>

              <li className="lg:hidden">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition font-medium"
                >
                  <FaSignOutAlt size={18} className="flex-shrink-0" />
                  <span className="text-sm">Logout</span>
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
