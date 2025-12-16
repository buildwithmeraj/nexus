import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../../../contexts/AuthContext";
import useAxiosSecureInstance from "../../../hooks/useSecureAxiosInstance.jsx";
import { HiUserCircle } from "react-icons/hi";
import {
  FaGraduationCap,
  FaUsers,
  FaCalendarAlt,
  FaTrophy,
} from "react-icons/fa";
import StatCard from "../../charts/StatCard.jsx";
import LineChartComponent from "../../charts/LineChart.jsx";
import PieChartComponent from "../../charts/PieChart.jsx";

const Member = () => {
  const location = useLocation();
  const { user, role } = useAuth();
  const axiosSecure = useAxiosSecureInstance();
  const [stats, setStats] = useState(null);
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("clubs");

  useEffect(() => {
    const fetchMemberStats = async () => {
      try {
        const response = await axiosSecure.get("/member/stats");
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching member stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberStats();
  }, [axiosSecure]);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await axiosSecure.get("/member/clubs");
        setClubs(response.data);
      } catch (error) {
        console.error("Error fetching clubs:", error);
      }
    };

    fetchClubs();
  }, [axiosSecure]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosSecure.get("/member/events");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [axiosSecure]);

  // Determine which tab to show based on URL
  const showClubs =
    location.pathname.includes("/clubs") ||
    location.pathname === "/dashboard/member" ||
    location.pathname === "/dashboard";
  const showEvents = location.pathname.includes("/events");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="flex items-center justify-center">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-base-300 rounded-2xl shadow-md p-8 max-w-xl">
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
              <p className="mt-1">{user?.email || "N/A"}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="badge badge-primary badge-lg capitalize">
                  {role || "member"}
                </span>
                {stats?.membershipStatus && (
                  <span className="badge badge-success badge-lg">
                    {stats.membershipStatus}
                  </span>
                )}
              </div>

              {role === "member" && (
                <div className="mt-4 flex gap-2 flex-wrap justify-center sm:justify-start">
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
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={FaUsers}
            title="My Clubs"
            value={stats?.totalClubs || 0}
            trend={stats?.clubsTrend || 0}
            trendUp={true}
          />
          <StatCard
            icon={FaCalendarAlt}
            title="Events Attended"
            value={stats?.eventsAttended || 0}
            trend={stats?.eventsTrend || 0}
            trendUp={true}
          />
          <StatCard
            icon={FaTrophy}
            title="Active Memberships"
            value={stats?.activeMemberships || 0}
            trend={stats?.membershipsTrend || 0}
            trendUp={true}
          />
          <StatCard
            icon={FaUsers}
            title="Friends in Clubs"
            value={stats?.friendsCount || 0}
            trend={stats?.friendsTrend || 0}
            trendUp={true}
          />
        </div>
      )}

      {/* Charts */}
      {stats?.eventAttendanceHistory && stats?.clubsBreakdown && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LineChartComponent
            data={stats.eventAttendanceHistory}
            title="Event Attendance (Last 6 Months)"
            dataKey="attendance"
          />
          <PieChartComponent
            data={stats.clubsBreakdown}
            title="Membership Distribution"
          />
        </div>
      )}
    </div>
  );
};

export default Member;
