import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../utilities/Loading";
import { FaDownload, FaFilter, FaChartBar } from "react-icons/fa";
import toast from "react-hot-toast";
import useAxiosSecureInstance from "../../../hooks/useSecureAxiosInstance";

const Payments = () => {
  const axiosSecure = useAxiosSecureInstance();
  const [filterType, setFilterType] = useState("all");

  // Fetch all payments
  const {
    data: paymentsData = { membershipPayments: [], eventPayments: [] },
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-payments"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/payments");
      return res.data;
    },
  });

  // Fetch payment statistics
  const { data: statistics = {} } = useQuery({
    queryKey: ["payment-statistics"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/payments/statistics");
      return res.data;
    },
  });

  const { membershipPayments = [], eventPayments = [] } = paymentsData;

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Export to CSV
  const exportToCSV = (data, filename) => {
    const headers = Object.keys(data[0] || {});
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            if (typeof value === "object") return "";
            return `"${value}"`;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
    toast.success("Downloaded successfully");
  };

  if (isLoading) return <Loading />;

  if (error) {
    return (
      <div className="alert alert-error">
        <span>Error loading payments: {error.message}</span>
      </div>
    );
  }

  const totalMemberships = membershipPayments.length;
  const totalEvents = eventPayments.length;
  const totalTransactions = totalMemberships + totalEvents;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold">Payment Management</h2>
        <p className="text-base-content/60 mt-1">
          Track all membership and event registration payments
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-6 border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/60 text-sm font-medium">
                Total Revenue
              </p>
              <p className="text-3xl font-bold mt-2">
                ${(statistics.totalRevenue || 0).toFixed(2)}
              </p>
            </div>
            <FaChartBar size={32} className="text-primary opacity-30" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-success/10 to-success/5 rounded-lg p-6 border border-success/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/60 text-sm font-medium">
                Membership Revenue
              </p>
              <p className="text-3xl font-bold mt-2">
                ${(statistics.membershipRevenue || 0).toFixed(2)}
              </p>
            </div>
            <div className="text-2xl font-bold text-success opacity-30">M</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-info/10 to-info/5 rounded-lg p-6 border border-info/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/60 text-sm font-medium">
                Event Revenue
              </p>
              <p className="text-3xl font-bold mt-2">
                ${(statistics.eventRevenue || 0).toFixed(2)}
              </p>
            </div>
            <div className="text-2xl font-bold text-info opacity-30">E</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-warning/10 to-warning/5 rounded-lg p-6 border border-warning/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/60 text-sm font-medium">
                Total Transactions
              </p>
              <p className="text-3xl font-bold mt-2">{totalTransactions}</p>
            </div>
            <div className="text-4xl text-warning opacity-20">📊</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-base-200">
        <button
          onClick={() => setFilterType("all")}
          className={`px-4 py-3 font-medium border-b-2 transition ${
            filterType === "all"
              ? "border-primary text-primary"
              : "border-transparent text-base-content/60 hover:text-base-content"
          }`}
        >
          All Payments ({totalTransactions})
        </button>
        <button
          onClick={() => setFilterType("membership")}
          className={`px-4 py-3 font-medium border-b-2 transition ${
            filterType === "membership"
              ? "border-primary text-primary"
              : "border-transparent text-base-content/60 hover:text-base-content"
          }`}
        >
          Memberships ({totalMemberships})
        </button>
        <button
          onClick={() => setFilterType("event")}
          className={`px-4 py-3 font-medium border-b-2 transition ${
            filterType === "event"
              ? "border-primary text-primary"
              : "border-transparent text-base-content/60 hover:text-base-content"
          }`}
        >
          Events ({totalEvents})
        </button>
      </div>

      {/* Membership Payments Table */}
      {(filterType === "all" || filterType === "membership") && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Club Membership Payments</h3>
            <button
              onClick={() => exportToCSV(membershipPayments, "memberships.csv")}
              className="btn btn-sm btn-outline gap-2"
              disabled={membershipPayments.length === 0}
            >
              <FaDownload size={14} />
              Export CSV
            </button>
          </div>

          {membershipPayments.length === 0 ? (
            <div className="bg-base-100 rounded-lg p-12 text-center border border-dashed border-base-300">
              <p className="text-base-content/60">
                No membership payments found
              </p>
            </div>
          ) : (
            <div className="bg-base-100 rounded-lg border border-base-200 overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead className="bg-base-200">
                  <tr>
                    <th>Member</th>
                    <th>Club</th>
                    <th>Amount</th>
                    <th>Payment Date</th>
                    <th>Status</th>
                    <th>Tier</th>
                  </tr>
                </thead>
                <tbody>
                  {membershipPayments.map((payment) => (
                    <tr key={payment._id}>
                      <td>
                        <div>
                          <p className="font-semibold">
                            {payment.userEmail || "Unknown"}
                          </p>
                        </div>
                      </td>
                      <td>{payment.relatedName || "Deleted Club"}</td>
                      <td className="font-semibold">
                        ${payment.amount?.toFixed(2) || "0.00"}
                      </td>
                      <td className="text-sm">
                        {formatDate(payment.createdAt)}
                      </td>
                      <td>
                        <span className="badge badge-success capitalize">
                          {payment.status}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-outline">Standard</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Event Registration Payments Table */}
      {(filterType === "all" || filterType === "event") && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Event Registration Payments</h3>
            <button
              onClick={() => exportToCSV(eventPayments, "events.csv")}
              className="btn btn-sm btn-outline gap-2"
              disabled={eventPayments.length === 0}
            >
              <FaDownload size={14} />
              Export CSV
            </button>
          </div>

          {eventPayments.length === 0 ? (
            <div className="bg-base-100 rounded-lg p-12 text-center border border-dashed border-base-300">
              <p className="text-base-content/60">
                No event registration payments found
              </p>
            </div>
          ) : (
            <div className="bg-base-100 rounded-lg border border-base-200 overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead className="bg-base-200">
                  <tr>
                    <th>Participant</th>
                    <th>Event</th>
                    <th>Amount</th>
                    <th>Registration Date</th>
                    <th>Status</th>
                    <th>Ticket</th>
                  </tr>
                </thead>
                <tbody>
                  {eventPayments.map((payment) => (
                    <tr key={payment._id}>
                      <td>
                        <div>
                          <p className="font-semibold">
                            {payment.userEmail || "Unknown"}
                          </p>
                        </div>
                      </td>
                      <td>{payment.relatedName || "Deleted Event"}</td>
                      <td className="font-semibold">
                        ${payment.amount?.toFixed(2) || "0.00"}
                      </td>
                      <td className="text-sm">
                        {formatDate(payment.createdAt)}
                      </td>
                      <td>
                        <span className="badge badge-success capitalize">
                          {payment.status}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-outline">
                          {payment.transactionId?.substring(0, 12)}...
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Payments;
