import React, { useEffect, useState } from "react";
import LineChartComponent from "../../charts/LineChart.jsx";
import PieChartComponent from "../../charts/PieChart.jsx";
import BarChartComponent from "../../charts/BarChart.jsx";
import {
  FaUsers,
  FaBuilding,
  FaCreditCard,
  FaCalendarAlt,
} from "react-icons/fa";
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
        <p className="">Overview of users, clubs, events, and payments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-6 border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/60 text-sm font-medium">
                Total Users
              </p>
              <p className="text-3xl font-bold mt-2">
                {stats?.totalUsers || 0}
              </p>
              {stats?.usersTrend !== undefined && (
                <p
                  className={`text-sm mt-2 font-semibold ${
                    stats.usersTrend >= 0 ? "text-success" : "text-error"
                  }`}
                >
                  {stats.usersTrend >= 0 ? "+" : ""}
                  {stats.usersTrend}%
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
            <FaBuilding size={32} className="text-success opacity-30" />
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-lg">Revenue Breakdown</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Membership Revenue:</span>
                <span className="font-bold">
                  ${(stats?.membershipRevenue || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Events Revenue:</span>
                <span className="font-bold">
                  ${(stats?.eventsRevenue || 0).toFixed(2)}
                </span>
              </div>
              <div className="divider my-2"></div>
              <div className="flex justify-between text-lg">
                <span>Total Revenue:</span>
                <span className="font-bold">
                  ${(stats?.totalRevenue || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-lg">Platform Stats</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Event Registrations:</span>
                <span className="font-bold">
                  {stats?.totalEventRegistrations || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Active Memberships:</span>
                <span className="font-bold">
                  {stats?.membershipDistribution?.find(
                    (m) => m.name === "active"
                  )?.value || 0}
                </span>
              </div>
              <div className="divider my-2"></div>
              <div className="text-sm text-gray-500">
                <p>
                  Avg Revenue per Event: $
                  {(
                    (stats?.eventsRevenue || 0) / (stats?.totalEvents || 1)
                  ).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stats?.userGrowth && stats.userGrowth.length > 0 && (
          <LineChartComponent
            data={stats.userGrowth}
            title="User Growth"
            dataKey="users"
          />
        )}
        {stats?.clubsByCategory && stats.clubsByCategory.length > 0 && (
          <PieChartComponent
            data={stats.clubsByCategory}
            title="Clubs by Category"
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stats?.revenueByMonth && stats.revenueByMonth.length > 0 && (
          <BarChartComponent
            data={stats.revenueByMonth}
            title="Revenue by Month"
            dataKey="revenue"
          />
        )}
        {stats?.eventsStatusDistribution &&
          stats.eventsStatusDistribution.length > 0 && (
            <PieChartComponent
              data={stats.eventsStatusDistribution}
              title="Events Status"
            />
          )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stats?.membershipDistribution &&
          stats.membershipDistribution.length > 0 && (
            <PieChartComponent
              data={stats.membershipDistribution}
              title="Membership Status Distribution"
            />
          )}
        {stats?.topEvents && stats.topEvents.length > 0 && (
          <BarChartComponent
            data={stats.topEvents}
            title="Top Events by Registration"
            dataKey="value"
          />
        )}
      </div>
    </div>
  );
};

export default Admin;
