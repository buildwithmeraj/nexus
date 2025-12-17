import React, { useEffect, useState } from "react";
import { Link } from "react-router";
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
  const { user, role } = useAuth();
  const axiosSecure = useAxiosSecureInstance();
  const [stats, setStats] = useState(null);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const activeMemberships =
    clubs?.filter((c) => c.membershipStatus === "active")?.length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Member Dashboard</h1>
        <p className="text-base-content/60 mt-1">
          Overview of your clubs and event registrations
        </p>
      </div>

      {/* Profile Card */}
      <div className="flex items-center justify-center">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-base-300 rounded-2xl shadow-md p-8 max-w-xl w-full">
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
              <p className="mt-1 text-base-content/60">
                {user?.email || "N/A"}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="badge badge-primary badge-lg capitalize">
                  {role || "member"}
                </span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-6 border border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base-content/60 text-sm font-medium">
                  My Clubs
                </p>
                <p className="text-3xl font-bold mt-2">
                  {stats?.totalClubs || 0}
                </p>
              </div>
              <FaUsers size={32} className="text-primary opacity-30" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-success/10 to-success/5 rounded-lg p-6 border border-success/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base-content/60 text-sm font-medium">
                  Active Memberships
                </p>
                <p className="text-3xl font-bold mt-2">{activeMemberships}</p>
              </div>
              <div className="text-2xl font-bold text-success opacity-30">
                M
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-info/10 to-info/5 rounded-lg p-6 border border-info/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base-content/60 text-sm font-medium">
                  Events Registered
                </p>
                <p className="text-3xl font-bold mt-2">
                  {stats?.eventsRegistered || 0}
                </p>
              </div>
              <FaCalendarAlt size={32} className="text-info opacity-30" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-warning/10 to-warning/5 rounded-lg p-6 border border-warning/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base-content/60 text-sm font-medium">
                  Achievements
                </p>
                <p className="text-3xl font-bold mt-2">
                  {stats?.achievements || 0}
                </p>
              </div>
              <FaTrophy size={32} className="text-warning opacity-30" />
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      {stats?.eventAttendanceHistory && stats?.clubsBreakdown && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LineChartComponent
            data={stats.eventAttendanceHistory}
            title="Event Registration (Last 6 Months)"
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
