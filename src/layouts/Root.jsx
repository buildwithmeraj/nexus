import React from "react";
import { Outlet, useLocation } from "react-router";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import { Toaster } from "react-hot-toast";

const Root = () => {
  const location = useLocation();

  // Close drawer when route changes
  React.useEffect(() => {
    const drawer = document.getElementById("navbar-drawer");
    if (drawer) {
      drawer.checked = false;
    }
  }, [location]);

  // Public pages layout
  return (
    <div className="drawer">
      <input id="navbar-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col min-h-screen">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 py-6">
          <Outlet />
        </main>

        {/* Toast */}
        <Toaster position="bottom-center" reverseOrder={false} />

        {/* Footer */}
        <Footer />
      </div>

      {/* Sidebar Drawer */}
      <div className="drawer-side z-40">
        <label
          htmlFor="navbar-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 min-h-full w-80 p-4 space-y-2">
          <li className="menu-title">
            <span>Navigation</span>
          </li>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/clubs">Clubs</a>
          </li>
          <li>
            <a href="/events">Events</a>
          </li>
          <li className="divider my-2"></li>
          <li className="menu-title">
            <span>Account</span>
          </li>
          <li>
            <a href="/login">Login</a>
          </li>
          <li>
            <a href="/register">Register</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Root;
