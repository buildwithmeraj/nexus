import React, { useEffect, useState } from "react";
import StatCard from "../../charts/StatCard.jsx";
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
        const response = await axiosSecure.get("/club-manager/stats");
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
        <StatCard
          icon={FaUsers}
          title="Total Members"
          value={stats?.totalMembers || 0}
          trend={stats?.membersTrend || 0}
          trendUp={true}
        />
        <StatCard
          icon={FaChartLine}
          title="Total Clubs"
          value={stats?.totalClubs || 0}
          trend={stats?.clubsTrend || 0}
          trendUp={true}
        />
        <StatCard
          icon={FaCalendarAlt}
          title="Total Events"
          value={stats?.totalEvents || 0}
          trend={stats?.eventsTrend || 0}
          trendUp={true}
        />
        <StatCard
          icon={FaCreditCard}
          title="Total Revenue"
          value={`$${stats?.totalRevenue || 0}`}
          trend={stats?.revenueTrend || 0}
          trendUp={true}
        />
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
