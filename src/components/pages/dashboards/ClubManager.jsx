import React, { useEffect, useState } from "react";
import LineChartComponent from "../../charts/LineChart.jsx";
import PieChartComponent from "../../charts/PieChart.jsx";
import BarChartComponent from "../../charts/BarChart.jsx";
import {
  FaUsers,
  FaCalendarAlt,
  FaCreditCard,
  FaChartLine,
} from "react-icons/fa";
import useAxiosSecureInstance from "../../../hooks/useSecureAxiosInstance.jsx";

const ClubManager = () => {
  const axiosSecure = useAxiosSecureInstance();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosSecure.get("/club-manager/statistics");
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching club manager stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [axiosSecure]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Club Manager Dashboard</h1>
        <p className="">Manage your clubs and track performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-6 border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/60 text-sm font-medium">
                Total Members
              </p>
              <p className="text-3xl font-bold mt-2">
                {stats?.totalMembers || 0}
              </p>
              {stats?.membersTrend !== undefined && (
                <p
                  className={`text-sm mt-2 font-semibold ${
                    stats.membersTrend >= 0 ? "text-success" : "text-error"
                  }`}
                >
                  {stats.membersTrend >= 0 ? "+" : ""}
                  {stats.membersTrend}%
                </p>
              )}
            </div>
            <FaUsers size={32} className="text-primary opacity-30" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-success/10 to-success/5 rounded-lg p-6 border border-success/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/60 text-sm font-medium">
                Total Clubs
              </p>
              <p className="text-3xl font-bold mt-2">
                {stats?.totalClubs || 0}
              </p>
              {stats?.clubsTrend !== undefined && (
                <p
                  className={`text-sm mt-2 font-semibold ${
                    stats.clubsTrend >= 0 ? "text-success" : "text-error"
                  }`}
                >
                  {stats.clubsTrend >= 0 ? "+" : ""}
                  {stats.clubsTrend}%
                </p>
              )}
            </div>
            <FaChartLine size={32} className="text-success opacity-30" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-info/10 to-info/5 rounded-lg p-6 border border-info/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/60 text-sm font-medium">
                Total Events
              </p>
              <p className="text-3xl font-bold mt-2">
                {stats?.totalEvents || 0}
              </p>
              {stats?.eventsTrend !== undefined && (
                <p
                  className={`text-sm mt-2 font-semibold ${
                    stats.eventsTrend >= 0 ? "text-success" : "text-error"
                  }`}
                >
                  {stats.eventsTrend >= 0 ? "+" : ""}
                  {stats.eventsTrend}%
                </p>
              )}
            </div>
            <FaCalendarAlt size={32} className="text-info opacity-30" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-warning/10 to-warning/5 rounded-lg p-6 border border-warning/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/60 text-sm font-medium">
                Total Revenue
              </p>
              <p className="text-3xl font-bold mt-2">
                ${(stats?.totalRevenue || 0).toFixed(2)}
              </p>
              {stats?.revenueTrend !== undefined && (
                <p
                  className={`text-sm mt-2 font-semibold ${
                    stats.revenueTrend >= 0 ? "text-success" : "text-error"
                  }`}
                >
                  {stats.revenueTrend >= 0 ? "+" : ""}
                  {stats.revenueTrend}%
                </p>
              )}
            </div>
            <FaCreditCard size={32} className="text-warning opacity-30" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stats?.membershipGrowth && (
          <LineChartComponent
            data={stats.membershipGrowth}
            title="Membership Growth (Last 6 Months)"
            dataKey="members"
          />
        )}
        {stats?.clubsDistribution && (
          <PieChartComponent
            data={stats.clubsDistribution}
            title="Members Distribution by Club"
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stats?.eventAttendance && (
          <BarChartComponent
            data={stats.eventAttendance}
            title="Event Attendance"
            dataKey="attendance"
          />
        )}
        {stats?.membershipStatus && (
          <PieChartComponent
            data={stats.membershipStatus}
            title="Membership Status"
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stats?.revenueByClub && (
          <BarChartComponent
            data={stats.revenueByClub}
            title="Revenue by Club"
            dataKey="revenue"
          />
        )}
        {stats?.eventStatus && (
          <PieChartComponent
            data={stats.eventStatus}
            title="Event Status Distribution"
          />
        )}
      </div>
    </div>
  );
};

export default ClubManager;
