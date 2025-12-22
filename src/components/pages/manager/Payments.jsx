import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaDownload, FaChartBar } from "react-icons/fa";
import toast from "react-hot-toast";
import useAxiosSecureInstance from "../../../hooks/useSecureAxiosInstance";
import LoadingDashboard from "../../utilities/LoadingDashboard";

const Payments = () => {
  const axiosSecure = useAxiosSecureInstance();
  const [filterType, setFilterType] = useState("all");

  // Fetch all manager payments
  const {
    data: paymentsData = { membershipPayments: [], eventPayments: [] },
    isLoading,
    error,
  } = useQuery({
    queryKey: ["manager-payments"],
    queryFn: async () => {
      const res = await axiosSecure.get("/manager/payments");
      return res.data;
    },
  });

  // Fetch payment statistics
  const { data: statistics = {} } = useQuery({
    queryKey: ["manager-payment-statistics"],
    queryFn: async () => {
      const res = await axiosSecure.get("/manager/payments/statistics");
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
    if (data.length === 0) {
      toast.error("No data to export");
      return;
    }

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

  if (isLoading) return <LoadingDashboard />;

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
      <div>
        <h2 className="text-3xl font-bold">Payment Management</h2>
        <p className="text-base-content/60 mt-1">
          Track all membership and event registration payments for your clubs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-6 border border-primary/20  backdrop-blur-md">
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

        <div className="bg-gradient-to-br from-success/10 to-success/5 rounded-lg p-6 border border-success/20 backdrop-blur-md">
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

        <div className="bg-gradient-to-br from-info/10 to-info/5 rounded-lg p-6 border border-info/20 backdrop-blur-md">
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

        <div className="bg-gradient-to-br from-warning/10 to-warning/5 rounded-lg p-6 border border-warning/20 backdrop-blur-md">
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
                    <th>Member Email</th>
                    <th>Club Name</th>
                    <th>Amount</th>
                    <th>Payment Date</th>
                    <th>Status</th>
                    <th>Transaction ID</th>
                  </tr>
                </thead>
                <tbody>
                  {membershipPayments.map((payment) => (
                    <tr key={payment._id}>
                      <td>
                        <div className="text-sm">
                          <p className="font-semibold">
                            {payment.userEmail || "Unknown"}
                          </p>
                        </div>
                      </td>
                      <td className="font-medium">
                        {payment.relatedName || "Deleted Club"}
                      </td>
                      <td className="font-semibold">
                        ${payment.amount?.toFixed(2) || "0.00"}
                      </td>
                      <td className="text-sm whitespace-nowrap">
                        {formatDate(payment.createdAt)}
                      </td>
                      <td>
                        <span className="badge badge-success capitalize">
                          {payment.status}
                        </span>
                      </td>
                      <td className="text-xs font-mono">
                        {payment.transactionId?.substring(0, 12)}...
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

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
                    <th>Participant Email</th>
                    <th>Event Name</th>
                    <th>Amount</th>
                    <th>Registration Date</th>
                    <th>Status</th>
                    <th>Transaction ID</th>
                  </tr>
                </thead>
                <tbody>
                  {eventPayments.map((payment) => (
                    <tr key={payment._id}>
                      <td>
                        <div className="text-sm">
                          <p className="font-semibold">
                            {payment.userEmail || "Unknown"}
                          </p>
                        </div>
                      </td>
                      <td className="font-medium">
                        {payment.relatedName || "Deleted Event"}
                      </td>
                      <td className="font-semibold">
                        ${payment.amount?.toFixed(2) || "0.00"}
                      </td>
                      <td className="text-sm whitespace-nowrap">
                        {formatDate(payment.createdAt)}
                      </td>
                      <td>
                        <span className="badge badge-success capitalize">
                          {payment.status}
                        </span>
                      </td>
                      <td className="text-xs font-mono">
                        {payment.transactionId?.substring(0, 12)}...
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {totalTransactions > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-base-200">
          <div className="bg-gradient-to-br from-success/10 to-success/5 rounded-lg p-6 border border-success/20 backdrop-blur-md">
            <h3 className="text-lg font-bold mb-4 text-success">
              Revenue Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-base-content/70">Membership Total:</span>
                <span className="font-semibold">
                  ${(statistics.membershipRevenue || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content/70">Events Total:</span>
                <span className="font-semibold">
                  ${(statistics.eventRevenue || 0).toFixed(2)}
                </span>
              </div>
              <div className="divider my-2"></div>
              <div className="flex justify-between text-lg">
                <span className="font-bold">Grand Total:</span>
                <span className="font-bold text-primary">
                  ${(statistics.totalRevenue || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-info/10 to-info/5 rounded-lg p-6 border border-info/20 backdrop-blur-md">
            <h3 className="text-lg font-bold mb-4 text-info">
              Transaction Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-base-content/70">
                  Membership Transactions:
                </span>
                <span className="font-semibold">
                  {statistics.membershipCount || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content/70">
                  Event Transactions:
                </span>
                <span className="font-semibold">
                  {statistics.eventCount || 0}
                </span>
              </div>
              <div className="divider my-2"></div>
              <div className="flex justify-between text-lg">
                <span className="font-bold">Total Transactions:</span>
                <span className="font-bold text-info">{totalTransactions}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
