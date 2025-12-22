import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { useAuth } from "../../../contexts/AuthContext";
import useAxiosSecureInstance from "../../../hooks/useSecureAxiosInstance.jsx";
import { HiUserCircle } from "react-icons/hi";
import {
  FaGraduationCap,
  FaUsers,
  FaCalendarAlt,
  FaTrophy,
  FaDollarSign,
  FaFire,
  FaChartLine,
} from "react-icons/fa";
import LineChartComponent from "../../charts/LineChart.jsx";
import PieChartComponent from "../../charts/PieChart.jsx";
import BarChartComponent from "../../charts/BarChart.jsx";
import LoadingDashboard from "../../utilities/LoadingDashboard";

const Member = () => {
  const { user, role } = useAuth();
  const axiosSecure = useAxiosSecureInstance();
  const [stats, setStats] = useState(null);
  const [clubSpending, setClubSpending] = useState([]);
  const [paymentTimeline, setPaymentTimeline] = useState([]);
  const [eventCategories, setEventCategories] = useState([]);
  const [activitySummary, setActivitySummary] = useState(null);
  const [spendingByType, setSpendingByType] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [
          statsRes,
          clubsRes,
          spendingRes,
          timelineRes,
          categoriesRes,
          activityRes,
          typeRes,
        ] = await Promise.all([
          axiosSecure.get("/member/statistics"),
          axiosSecure.get("/member/clubs"),
          axiosSecure.get("/member/club-spending"),
          axiosSecure.get("/member/payment-timeline"),
          axiosSecure.get("/member/event-categories"),
          axiosSecure.get("/member/activity-summary"),
          axiosSecure.get("/member/spending-by-type"),
        ]);

        setStats(statsRes.data);
        setClubs(clubsRes.data);
        setClubSpending(spendingRes.data);
        setPaymentTimeline(timelineRes.data);
        setEventCategories(categoriesRes.data);
        setActivitySummary(activityRes.data);
        setSpendingByType(typeRes.data);
      } catch (error) {
        console.error("Error fetching member data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [axiosSecure]);

  if (loading) {
    return <LoadingDashboard />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    whileHover: {
      y: -5,
      boxShadow: "0 20px 25px rgba(0,0,0,0.1)",
      transition: {
        duration: 0.3,
      },
    },
  };

  const activeMemberships =
    clubs?.filter((c) => c.membershipStatus === "active")?.length || 0;

  return (
    <motion.div initial="hidden" animate="visible" className="space-y-6">
      <motion.div>
        <h1 className="text-3xl font-bold">Member Dashboard</h1>
        <p className="text-base-content/60 mt-1">
          Overview of your clubs and event registrations
        </p>
      </motion.div>

      <motion.div>
        <div className="flex items-center justify-center">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-base-300 rounded-2xl shadow-md p-8 max-w-xl w-full backdrop-blur-md">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="flex-shrink-0"
              >
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
              </motion.div>

              <div className="flex-1 text-center sm:text-left">
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-bold"
                >
                  {user?.displayName || "User"}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                  className="mt-1 text-base-content/60"
                >
                  {user?.email || "N/A"}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap gap-2 mt-3"
                >
                  <span className="badge badge-primary badge-lg capitalize">
                    {role || "member"}
                  </span>
                </motion.div>

                {role === "member" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="mt-4 flex gap-2 flex-wrap justify-center sm:justify-start"
                  >
                    <Link
                      to="/dashboard/member/apply-for-club-manager"
                      className="btn btn-outline btn-primary btn-sm gap-2"
                    >
                      <FaGraduationCap size={16} />
                      Apply for Club Manager
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div
          variants={cardVariants}
          whileHover="whileHover"
          className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-6 border border-primary/20 backdrop-blur-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/60 text-sm font-medium">
                My Clubs
              </p>
              <motion.p
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-3xl font-bold mt-2"
              >
                {stats?.totalClubs || 0}
              </motion.p>
            </div>
            <FaUsers size={32} className="text-primary opacity-30" />
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          whileHover="whileHover"
          className="bg-gradient-to-br from-success/10 to-success/5 rounded-lg p-6 border border-success/20 backdrop-blur-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/60 text-sm font-medium">
                Active Memberships
              </p>
              <motion.p
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="text-3xl font-bold mt-2"
              >
                {activeMemberships}
              </motion.p>
            </div>
            <FaFire size={32} className="text-success opacity-30" />
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          whileHover="whileHover"
          className="bg-gradient-to-br from-info/10 to-info/5 rounded-lg p-6 border border-info/20 backdrop-blur-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/60 text-sm font-medium">
                Events Registered
              </p>
              <motion.p
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-3xl font-bold mt-2"
              >
                {stats?.eventsRegistered || 0}
              </motion.p>
            </div>
            <FaCalendarAlt size={32} className="text-info opacity-30" />
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          whileHover="whileHover"
          className="bg-gradient-to-br from-warning/10 to-warning/5 rounded-lg p-6 border border-warning/20 backdrop-blur-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/60 text-sm font-medium">
                Total Spent
              </p>
              <motion.p
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="text-3xl font-bold mt-2"
              >
                ${(activitySummary?.thisMonthSpent || 0).toFixed(2)}
              </motion.p>
            </div>
            <FaDollarSign size={32} className="text-warning opacity-30" />
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {stats?.eventAttendanceHistory &&
          stats?.eventAttendanceHistory.length > 0 && (
            <motion.div variants={cardVariants} whileHover="whileHover">
              <LineChartComponent
                data={stats.eventAttendanceHistory}
                title="Event Registration (Last 6 Months)"
                dataKey="attendance"
              />
            </motion.div>
          )}

        {spendingByType && spendingByType.length > 0 && (
          <motion.div variants={cardVariants} whileHover="whileHover">
            <PieChartComponent
              data={spendingByType}
              title="Spending Breakdown"
            />
          </motion.div>
        )}
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {paymentTimeline && paymentTimeline.length > 0 && (
          <motion.div variants={cardVariants} whileHover="whileHover">
            <BarChartComponent
              data={paymentTimeline}
              title="Payment Timeline (Last 12 Months)"
              dataKey="amount"
            />
          </motion.div>
        )}

        {clubSpending && clubSpending.length > 0 && (
          <motion.div variants={cardVariants} whileHover="whileHover">
            <PieChartComponent data={clubSpending} title="Spending by Club" />
          </motion.div>
        )}
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {stats?.clubsBreakdown && stats?.clubsBreakdown.length > 0 && (
          <motion.div variants={cardVariants} whileHover="whileHover">
            <PieChartComponent
              data={stats.clubsBreakdown}
              title="Membership Distribution"
            />
          </motion.div>
        )}

        {eventCategories && eventCategories.length > 0 && (
          <motion.div variants={cardVariants} whileHover="whileHover">
            <BarChartComponent
              data={eventCategories}
              title="Events by Category"
              dataKey="value"
            />
          </motion.div>
        )}
      </motion.div>

      {activitySummary && (
        <motion.div className="bg-base-100 border border-base-300 rounded-lg p-8">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold mb-6 flex items-center gap-2"
          >
            <FaChartLine className="text-primary" />
            Activity Summary
          </motion.h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {activitySummary.mostVisitedClub && (
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-lg border border-primary/20"
              >
                <p className="text-sm font-semibold text-base-content/60 mb-2">
                  Most Active Club
                </p>
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl font-bold"
                >
                  {activitySummary.mostVisitedClub.clubName}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="text-sm text-base-content/60 mt-2"
                >
                  Joined:{" "}
                  {new Date(
                    activitySummary.mostVisitedClub.joinedAt
                  ).toLocaleDateString()}
                </motion.p>
              </motion.div>
            )}

            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-success/10 to-success/5 p-6 rounded-lg border border-success/20"
            >
              <p className="text-sm font-semibold text-base-content/60 mb-2">
                Upcoming Events
              </p>
              <motion.h3
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-3xl font-bold text-success"
              >
                {activitySummary.upcomingEvents?.length || 0}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="text-xs text-base-content/60 mt-2"
              >
                Events to attend
              </motion.p>
            </motion.div>
          </motion.div>

          {activitySummary.upcomingEvents &&
            activitySummary.upcomingEvents.length > 0 && (
              <motion.div
                variants={itemVariants}
                className="mt-6 pt-6 border-t border-base-300"
              >
                <h4 className="font-semibold mb-4">Next Events</h4>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-3"
                >
                  {activitySummary.upcomingEvents
                    .slice(0, 3)
                    .map((event, idx) => (
                      <motion.div
                        key={idx}
                        variants={itemVariants}
                        className="flex items-center justify-between p-3 bg-base-50 rounded-lg"
                      >
                        <div>
                          <p className="font-semibold text-sm">{event.title}</p>
                          <p className="text-xs text-base-content/60">
                            {new Date(event.eventDate).toLocaleDateString()} •{" "}
                            {event.location}
                          </p>
                        </div>
                        <FaCalendarAlt className="text-primary opacity-60" />
                      </motion.div>
                    ))}
                </motion.div>
              </motion.div>
            )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Member;
