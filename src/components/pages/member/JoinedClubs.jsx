import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecureInstance from "../../../hooks/useSecureAxiosInstance";
import { useAuth } from "../../../contexts/AuthContext";
import Loading from "../../utilities/Loading";
import { Link } from "react-router";
import {
  FaUsers,
  FaMapMarkerAlt,
  FaCalendar,
  FaDollarSign,
  FaExclamationTriangle,
  FaRedo,
  FaSignOutAlt,
} from "react-icons/fa";
import toast from "react-hot-toast";

const JoinedClubs = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecureInstance();
  const queryClient = useQueryClient();

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [isLeavingClub, setIsLeavingClub] = useState(false);

  // Fetch user's memberships
  const {
    data: memberships = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user-memberships", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get("/users/memberships");
      return res.data;
    },
  });

  // Filter for active memberships
  const activeMemberships = memberships.filter((m) => m.status === "active");
  const expiredMemberships = memberships.filter((m) => m.status === "expired");

  const handleLeaveClick = (membership) => {
    setSelectedMembership(membership);
    setShowLeaveModal(true);
  };

  const handleConfirmLeave = async () => {
    if (!selectedMembership) return;

    setIsLeavingClub(true);
    try {
      await axiosSecure.delete(`/memberships/${selectedMembership._id}`);
      toast.success(`Left ${selectedMembership.clubName} successfully`);
      setShowLeaveModal(false);
      setSelectedMembership(null);
      refetch();
      queryClient.invalidateQueries(["user-memberships"]);
    } catch (error) {
      console.error("Error leaving club:", error);
      toast.error(error.response?.data?.message || "Failed to leave club");
    } finally {
      setIsLeavingClub(false);
    }
  };

  const handleRenewClick = (clubId) => {
    // Redirect to renewal flow
    window.location.href = `/clubs/${clubId}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const daysUntilExpiry = (expiresAt) => {
    const days = Math.ceil(
      (new Date(expiresAt) - new Date()) / (1000 * 60 * 60 * 24)
    );
    return Math.max(0, days);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">My Clubs</h1>
        <p className="text-gray-600 text-sm mt-1">
          Manage your club memberships ({activeMemberships.length} active)
        </p>
      </div>

      {/* Active Memberships */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Active Memberships</h2>

        {activeMemberships.length === 0 ? (
          <div className="bg-base-100 rounded-lg p-12 text-center border-2 border-dashed border-base-300">
            <FaUsers className="text-4xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 font-semibold mb-2">
              No Active Memberships
            </p>
            <p className="text-gray-400 text-sm mb-4">
              Join clubs to get started
            </p>
            <Link to="/clubs" className="btn btn-primary btn-sm">
              Browse Clubs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Club Name</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Joined Date</th>
                    <th>Expires</th>
                    <th>Days Left</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeMemberships.map((membership) => {
                    const daysLeft = daysUntilExpiry(membership.expiresAt);
                    const isExpiringSoon = daysLeft <= 30 && daysLeft > 0;

                    return (
                      <tr key={membership._id} className="hover:bg-base-200">
                        <td className="font-semibold">{membership.clubName}</td>
                        <td>
                          <span className="badge badge-outline">
                            {membership.clubCategory}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <FaMapMarkerAlt size={14} className="text-error" />
                            {membership.clubLocation}
                          </div>
                        </td>
                        <td className="text-sm">
                          {formatDate(membership.joinedAt)}
                        </td>
                        <td className="text-sm">
                          {formatDate(membership.expiresAt)}
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              isExpiringSoon ? "badge-warning" : "badge-success"
                            }`}
                          >
                            {daysLeft} days
                          </span>
                        </td>
                        <td className="flex gap-2">
                          <Link
                            to={`/clubs/${membership.clubId}`}
                            className="btn btn-sm btn-primary gap-1"
                          >
                            View
                          </Link>
                          {isExpiringSoon && (
                            <button
                              className="btn btn-sm btn-warning gap-1"
                              onClick={() =>
                                handleRenewClick(membership.clubId)
                              }
                              title="Renew membership"
                            >
                              <FaRedo size={12} />
                              Renew
                            </button>
                          )}
                          <button
                            className="btn btn-sm btn-ghost text-error gap-1"
                            onClick={() => handleLeaveClick(membership)}
                            title="Leave club"
                          >
                            <FaSignOutAlt size={12} />
                            Leave
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden grid grid-cols-1 gap-4">
              {activeMemberships.map((membership) => {
                const daysLeft = daysUntilExpiry(membership.expiresAt);
                const isExpiringSoon = daysLeft <= 30 && daysLeft > 0;

                return (
                  <div
                    key={membership._id}
                    className="bg-base-100 rounded-lg p-4 border border-base-300 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">
                          {membership.clubName}
                        </h3>
                        <span className="badge badge-outline badge-sm">
                          {membership.clubCategory}
                        </span>
                      </div>
                      <span
                        className={`badge ${
                          isExpiringSoon ? "badge-warning" : "badge-success"
                        }`}
                      >
                        {daysLeft}d
                      </span>
                    </div>

                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt
                          size={14}
                          className="text-error flex-shrink-0"
                        />
                        <span>{membership.clubLocation}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaCalendar
                          size={14}
                          className="text-primary flex-shrink-0"
                        />
                        <span>Joined {formatDate(membership.joinedAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaCalendar
                          size={14}
                          className="text-warning flex-shrink-0"
                        />
                        <span>Expires {formatDate(membership.expiresAt)}</span>
                      </div>
                    </div>

                    {isExpiringSoon && (
                      <div className="alert alert-warning alert-sm mb-3">
                        <FaExclamationTriangle />
                        <span className="text-sm">
                          Your membership is expiring soon
                        </span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Link
                        to={`/clubs/${membership.clubId}`}
                        className="btn btn-sm btn-primary flex-1"
                      >
                        View Club
                      </Link>
                      {isExpiringSoon && (
                        <button
                          className="btn btn-sm btn-warning flex-1 gap-1"
                          onClick={() => handleRenewClick(membership.clubId)}
                        >
                          <FaRedo size={12} />
                          Renew
                        </button>
                      )}
                    </div>

                    <button
                      className="btn btn-sm btn-ghost text-error w-full mt-2 gap-1"
                      onClick={() => handleLeaveClick(membership)}
                    >
                      <FaSignOutAlt size={12} />
                      Leave Club
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Expired Memberships */}
      {expiredMemberships.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Expired Memberships</h2>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="table w-full opacity-75">
              <thead>
                <tr>
                  <th>Club Name</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Joined Date</th>
                  <th>Expired Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expiredMemberships.map((membership) => (
                  <tr key={membership._id} className="hover:bg-base-200">
                    <td className="font-semibold">{membership.clubName}</td>
                    <td>
                      <span className="badge badge-outline">
                        {membership.clubCategory}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt size={14} className="text-error" />
                        {membership.clubLocation}
                      </div>
                    </td>
                    <td className="text-sm">
                      {formatDate(membership.joinedAt)}
                    </td>
                    <td className="text-sm">
                      {formatDate(membership.expiresAt)}
                    </td>
                    <td className="flex gap-2">
                      <button
                        className="btn btn-sm btn-success gap-1"
                        onClick={() => handleRenewClick(membership.clubId)}
                      >
                        <FaRedo size={12} />
                        Renew
                      </button>
                      <button
                        className="btn btn-sm btn-ghost text-error gap-1"
                        onClick={() => handleLeaveClick(membership)}
                        title="Remove membership"
                      >
                        <FaSignOutAlt size={12} />
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden grid grid-cols-1 gap-4">
            {expiredMemberships.map((membership) => (
              <div
                key={membership._id}
                className="bg-base-100 rounded-lg p-4 border border-base-300 shadow-sm opacity-75"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{membership.clubName}</h3>
                    <span className="badge badge-outline badge-sm">
                      {membership.clubCategory}
                    </span>
                  </div>
                  <span className="badge badge-error">Expired</span>
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt
                      size={14}
                      className="text-error flex-shrink-0"
                    />
                    <span>{membership.clubLocation}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCalendar
                      size={14}
                      className="text-primary flex-shrink-0"
                    />
                    <span>Joined {formatDate(membership.joinedAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCalendar
                      size={14}
                      className="text-error flex-shrink-0"
                    />
                    <span>Expired {formatDate(membership.expiresAt)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    className="btn btn-sm btn-success flex-1 gap-1"
                    onClick={() => handleRenewClick(membership.clubId)}
                  >
                    <FaRedo size={12} />
                    Renew
                  </button>
                  <button
                    className="btn btn-sm btn-ghost text-error flex-1 gap-1"
                    onClick={() => handleLeaveClick(membership)}
                  >
                    <FaSignOutAlt size={12} />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leave Club Confirmation Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="bg-error/10 rounded-full p-3">
                <FaExclamationTriangle className="text-error text-xl" />
              </div>
              <h3 className="text-lg font-bold">Leave Club</h3>
            </div>

            {/* Message */}
            <div className="space-y-3">
              <p className="text-gray-700">
                Are you sure you want to leave{" "}
                <span className="font-bold">
                  {selectedMembership?.clubName}
                </span>
                ?
              </p>

              <div className="alert alert-warning text-sm">
                <FaExclamationTriangle size={16} />
                <div>
                  <p className="font-semibold">Once you leave:</p>
                  <ul className="list-disc list-inside text-xs mt-1 space-y-1">
                    <li>You'll lose access to club events</li>
                    <li>Your membership data will be archived</li>
                    <li>You can rejoin by purchasing a new membership</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  setShowLeaveModal(false);
                  setSelectedMembership(null);
                }}
                className="btn btn-ghost flex-1"
                disabled={isLeavingClub}
              >
                Stay in Club
              </button>
              <button
                onClick={handleConfirmLeave}
                className="btn btn-error flex-1"
                disabled={isLeavingClub}
              >
                {isLeavingClub ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  "Leave Club"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinedClubs;
