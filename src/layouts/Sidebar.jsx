import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate, Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import Footer from "../components/shared/Footer";
import Navbar from "../components/shared/Navbar";
import {
  FaUsers,
  FaClipboardList,
  FaCalendar,
  FaSignOutAlt,
  FaCog,
  FaChartBar,
  FaPlus,
} from "react-icons/fa";
import { ImStatsDots } from "react-icons/im";
import { MdDashboard, MdOutlinePayment } from "react-icons/md";

export default function Sidebar() {
  const { user, logOut, role } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const userRole = role || "member";

  useEffect(() => {
    const drawer = document.getElementById("dashboard-drawer");
    if (drawer) drawer.checked = false;
  }, [location]);

  const menus = {
    admin: [
      { label: "Dashboard", to: "/dashboard", icon: MdDashboard },
      { label: "Overview", to: "/dashboard/admin", icon: ImStatsDots },
      { label: "Users", to: "/dashboard/admin/users", icon: FaUsers },
      { label: "Clubs", to: "/dashboard/admin/clubs", icon: FaClipboardList },
      {
        label: "Events",
        to: "/dashboard/admin/events",
        icon: FaCalendar,
      },
      { label: "Payments", to: "/dashboard/admin/payments", icon: FaChartBar },
      {
        label: "Add Club",
        to: "/dashboard/admin/add-club",
        icon: FaPlus,
      },
    ],
    clubManager: [
      { label: "Dashboard", to: "/dashboard", icon: MdDashboard },
      { label: "Overview", to: "/dashboard/club-manager", icon: ImStatsDots },

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
        label: "Payments",
        to: "/dashboard/club-manager/payments",
        icon: MdOutlinePayment,
      },
      {
        label: "Add Club",
        to: "/dashboard/club-manager/add-club",
        icon: FaPlus,
      },
    ],
    member: [
      { label: "Dashboard", to: "/dashboard", icon: MdDashboard },
      {
        label: "My Clubs",
        to: "/dashboard/member/clubs",
        icon: FaClipboardList,
      },
      {
        label: "My Events",
        to: "/dashboard/member/events",
        icon: FaCalendar,
      },
      {
        label: "Payments",
        to: "/dashboard/member/payments",
        icon: MdOutlinePayment,
      },
      {
        label: "Apply for Club Manager",
        to: "/dashboard/member/apply-for-club-manager",
        icon: FaUsers,
      },
    ],
  };

  const currentMenus = menus[userRole] || menus.member;
  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Logged out successfully");
      navigate("/");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="drawer lg:drawer-open">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mt-16 mx-auto w-full">
          <Outlet />
        </main>

        <Toaster position="bottom-center" />
        <Footer />
      </div>

      <div className="drawer-side z-40 pt-16">
        <label htmlFor="dashboard-drawer" className="drawer-overlay" />

        <aside className="w-80 min-h-full bg-base-200 border-r border-base-300 p-4 flex flex-col">
          {user && (
            <>
              <div className="flex items-center gap-4 p-3 rounded-xl bg-base-100 shadow-sm mb-2">
                <div className="avatar">
                  <div className="w-12 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName}
                        className="object-cover"
                      />
                    ) : (
                      <span>{user.displayName?.charAt(0) || "U"}</span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-sm truncate">
                    {user.displayName}
                  </p>
                  <span className="badge badge-sm badge-primary capitalize">
                    {userRole}
                  </span>
                </div>
              </div>

              <ul className="menu w-full space-y-1 flex-1">
                {currentMenus.map(({ label, to, icon: Icon }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition 
                        ${
                          isActive(to)
                            ? "bg-primary text-primary-content font-semibold"
                            : "hover:bg-base-300"
                        }`}
                    >
                      <Icon size={18} />
                      <span className="text-sm">{label}</span>

                      {isActive(to) && <span className="" />}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-4 border-t border-base-300 space-y-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 text-error transition w-full text-left"
                >
                  <FaSignOutAlt size={18} />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
