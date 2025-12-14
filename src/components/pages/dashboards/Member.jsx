import React from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../../../contexts/AuthContext";
import { HiUserCircle } from "react-icons/hi";
import { FaGraduationCap } from "react-icons/fa";

const Member = () => {
  const location = useLocation();
  const { user, role } = useAuth();

  // Determine which tab/view to show based on URL
  const showClubs =
    location.pathname.includes("/clubs") ||
    location.pathname === "/dashboard" ||
    location.pathname === "/dashboard/member";
  const showEvents = location.pathname.includes("/events");

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-base-100 border border-base-300 rounded-2xl shadow-md p-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-primary shadow-lg object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <HiUserCircle className="text-8xl text-primary/70" />
            )}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-3xl font-bold">
              {user?.displayName || "User"}
            </h2>
            <p className="text-gray-600 mt-1">{user?.email || "N/A"}</p>
            <span className="badge badge-primary badge-lg capitalize mt-3">
              {role || "member"}
            </span>

            {role === "member" && (
              <div className="mt-4">
                <Link
                  to="/dashboard/member/apply-for-club-manager"
                  className="btn btn-outline btn-primary btn-sm gap-2"
                >
                  <FaGraduationCap size={16} />
                  Apply for Club Manager
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tabs tabs-bordered border-base-300">
        <Link
          to="/dashboard/member"
          className={`tab ${showClubs ? "tab-active" : ""}`}
        >
          My Clubs
        </Link>
        <Link
          to="/dashboard/member/events"
          className={`tab ${showEvents ? "tab-active" : ""}`}
        >
          My Events
        </Link>
      </div>

      {/* Content based on active tab */}
      {showClubs && (
        <div className="bg-base-100 rounded-lg p-6 shadow border border-base-300">
          <h3>My Clubs</h3>
          {/* Add your clubs content here */}
          <p className="text-gray-600">Clubs content will be displayed here.</p>
        </div>
      )}

      {showEvents && (
        <div className="bg-base-100 rounded-lg p-6 shadow border border-base-300">
          <h3>My Events</h3>
          {/* Add your events content here */}
          <p className="text-gray-600">
            Events content will be displayed here.
          </p>
        </div>
      )}
    </div>
  );
};

export default Member;
