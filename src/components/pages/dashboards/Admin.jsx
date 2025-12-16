import React, { useEffect, useState } from "react";
import StatCard from "../../charts/StatCard.jsx";
import LineChartComponent from "../../charts/LineChart.jsx";
import PieChartComponent from "../../charts/PieChart.jsx";
import BarChartComponent from "../../charts/BarChart.jsx";
import { FaUsers, FaBuilding, FaCreditCard } from "react-icons/fa";
import useAxiosSecureInstance from "../../../hooks/useSecureAxiosInstance.jsx";

const Admin = () => {
  const axiosSecure = useAxiosSecureInstance();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosSecure.get("/admin/stats");
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
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
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="">Overview of users, clubs, and payments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={FaUsers}
          title="Total Users"
          value={stats?.totalUsers || 0}
          trend={stats?.usersTrend || 0}
          trendUp={true}
        />
        <StatCard
          icon={FaBuilding}
          title="Total Clubs"
          value={stats?.totalClubs || 0}
          trend={stats?.clubsTrend || 0}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stats?.userGrowth && (
          <LineChartComponent
            data={stats.userGrowth}
            title="User Growth (Last 6 Months)"
            dataKey="users"
          />
        )}
        {stats?.clubsByCategory && (
          <PieChartComponent
            data={stats.clubsByCategory}
            title="Clubs by Category"
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stats?.revenueByMonth && (
          <BarChartComponent
            data={stats.revenueByMonth}
            title="Revenue by Month"
            dataKey="revenue"
          />
        )}
        {stats?.membershipDistribution && (
          <PieChartComponent
            data={stats.membershipDistribution}
            title="Membership Status Distribution"
          />
        )}
      </div>
    </div>
  );
};

export default Admin;
