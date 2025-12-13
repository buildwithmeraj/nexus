import React from "react";
import Logo from "../utilities/Logo";
import ThemeSwitcher from "../utilities/ThemeSwitcher";
import { FaUser } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router";
import { RiMenuFill } from "react-icons/ri";

const Navbar = () => {
  const { user, logOut, authLoading } = useAuth();
  return (
    <section className="w-full bg-base-100 shadow-sm">
      <div className="navbar max-w-384 mx-auto">
        <div className="navbar-start">
          <div className="drawer">
            <input id="my-drawer-1" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
              <label
                htmlFor="my-drawer-1"
                className="btn btn-circle btn-ghost drawer-button"
              >
                <RiMenuFill size={18} />
              </label>
            </div>
            <div className="drawer-side">
              <label
                htmlFor="my-drawer-1"
                aria-label="close sidebar"
                className="drawer-overlay"
              ></label>
              <ul className="menu bg-base-200 min-h-full w-80 p-4">
                <li>
                  <a
                    href="#"
                    onClick={() => {
                      // Uncheck the checkbox to close the drawer
                      document.getElementById("my-drawer-1").checked = false;
                    }}
                  >
                    Close
                  </a>
                </li>
                <li>
                  <a>Sidebar Item 2</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="navbar-center">
          <Link className="text-xl" to="/">
            <Logo />
          </Link>
        </div>
        <div className="navbar-end">
          <div className="dropdown dropdown-center">
            <div
              tabIndex={0}
              role="button"
              className="btn m-1 btn-ghost btn-circle relative"
            >
              <FaUser />
            </div>
            <ul
              tabIndex="-1"
              className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm mt-1 user-menu"
            >
              {authLoading ? (
                <span className="loading loading-spinner text-primary"></span>
              ) : user ? (
                <>
                  <li>
                    <Link to="/dashboard">Profile</Link>
                  </li>
                  <li>
                    <button onClick={() => logOut()}>Logout</button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login">Login</Link>
                  </li>
                  <li>
                    <a>Register</a>
                  </li>
                </>
              )}
            </ul>
          </div>
          <button className="btn btn-ghost btn-circle">
            <div className="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />{" "}
              </svg>
              <span className="badge badge-xs badge-primary indicator-item"></span>
            </div>
          </button>
          <ThemeSwitcher />
        </div>
      </div>
    </section>
  );
};

export default Navbar;
