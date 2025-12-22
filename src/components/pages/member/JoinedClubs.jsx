import React, { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecureInstance from "../../../hooks/useSecureAxiosInstance";
import { useAuth } from "../../../contexts/AuthContext";
import Loading from "../../utilities/Loading";
import { Link } from "react-router";
import {
  FaUsers,
  FaMapMarkerAlt,
  FaCalendar,
  FaExclamationTriangle,
  FaRedo,
  FaSignOutAlt,
  FaExternalLinkSquareAlt,
} from "react-icons/fa";
import toast from "react-hot-toast";
import LoadingDashboard from "../../utilities/LoadingDashboard";

const JoinedClubs = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecureInstance();
  const queryClient = useQueryClient();

  const leaveDialogRef = useRef(null);

  const [selectedMembership, setSelectedMembership] = useState(null);
  const [isLeavingClub, setIsLeavingClub] = useState(false);

  const {
    data: memberships = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user-memberships", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get("/member/memberships");
      return res.data;
    },
    enabled: !!user?.email,
  });

  const activeMemberships = memberships.filter((m) => m.status === "active");
  const expiredMemberships = memberships.filter((m) => m.status === "expired");

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const daysUntilExpiry = (expiresAt) =>
    Math.max(
      0,
      Math.ceil((new Date(expiresAt) - new Date()) / (1000 * 60 * 60 * 24))
    );

  const openLeaveModal = (membership) => {
    setSelectedMembership(membership);
    leaveDialogRef.current?.showModal();
  };

  const closeLeaveModal = () => {
    leaveDialogRef.current?.close();
    setSelectedMembership(null);
  };

  const handleConfirmLeave = async () => {
    if (!selectedMembership) return;

    setIsLeavingClub(true);
    try {
      await axiosSecure.delete(`/memberships/${selectedMembership._id}`);
      toast.success(`Left ${selectedMembership.clubName}`);
      await refetch();
      queryClient.invalidateQueries(["user-memberships"]);
      closeLeaveModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to leave club");
    } finally {
      setIsLeavingClub(false);
    }
  };

  const handleRenewClick = (clubId) => {
    window.location.href = `/clubs/${clubId}`;
  };

  if (isLoading) return <LoadingDashboard />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Clubs</h1>
        <p className="text-sm mt-1">
          Manage your memberships ({activeMemberships.length} active,{" "}
          {expiredMemberships.length} expired)
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Active Memberships</h2>

        {activeMemberships.length === 0 ? (
          <div className="bg-base-100 rounded-lg p-12 text-center border-2 border-dashed border-base-300">
            <FaUsers className="text-4xl mx-auto mb-4" />
            <p className="font-semibold mb-2">No Active Memberships</p>
            <p className="text-sm mb-4">Join clubs to see them here</p>
            <Link to="/clubs" className="btn btn-primary btn-sm">
              Browse Clubs
            </Link>
          </div>
        ) : (
          <>
            <div className="hidden lg:block overflow-x-auto backdrop-blur-md">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Club</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Joined</th>
                    <th>Expires</th>
                    <th>Days Left</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeMemberships.map((m) => {
                    const daysLeft = daysUntilExpiry(m.expiresAt);
                    const expiring = daysLeft <= 30;

                    return (
                      <tr key={m._id}>
                        <td className="font-semibold">{m.clubName}</td>
                        <td>{m.clubCategory}</td>
                        <td>
                          <FaMapMarkerAlt className="inline mr-1 text-error" />
                          {m.clubLocation}
                        </td>
                        <td>{formatDate(m.joinedAt)}</td>
                        <td>{formatDate(m.expiresAt)}</td>
                        <td>
                          <span
                            className={`badge ${
                              expiring ? "badge-warning" : "badge-success"
                            }`}
                          >
                            {daysLeft} days
                          </span>
                        </td>
                        <td className="flex gap-2">
                          <Link
                            to={`/clubs/${m.clubId}`}
                            className="btn btn-sm btn-primary"
                          >
                            <FaExternalLinkSquareAlt />
                            View
                          </Link>
                          {expiring && (
                            <button
                              className="btn btn-sm btn-warning"
                              onClick={() => handleRenewClick(m.clubId)}
                            >
                              <FaRedo />
                            </button>
                          )}
                          <button
                            className="btn btn-sm btn-error"
                            onClick={() => openLeaveModal(m)}
                          >
                            <FaSignOutAlt /> Leave
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="lg:hidden grid gap-4">
              {activeMemberships.map((m) => {
                const daysLeft = daysUntilExpiry(m.expiresAt);
                const expiring = daysLeft <= 30;

                return (
                  <div
                    key={m._id}
                    className="bg-base-100 border rounded-lg p-4"
                  >
                    <h3 className="font-bold">{m.clubName}</h3>
                    <span className="badge badge-outline">
                      {m.clubCategory}
                    </span>

                    <div className="text-sm mt-2 space-y-1">
                      <p>
                        <FaMapMarkerAlt className="inline mr-1 text-error" />
                        {m.clubLocation}
                      </p>
                      <p>Expires: {formatDate(m.expiresAt)}</p>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Link
                        to={`/clubs/${m.clubId}`}
                        className="btn btn-sm btn-primary flex-1"
                      >
                        <FaExternalLinkSquareAlt />
                        View
                      </Link>
                      {expiring && (
                        <button
                          className="btn btn-sm btn-warning flex-1"
                          onClick={() => handleRenewClick(m.clubId)}
                        >
                          <FaRedo />
                          Renew
                        </button>
                      )}
                    </div>

                    <button
                      className="btn btn-sm btn-ghost text-error w-full mt-2"
                      onClick={() => openLeaveModal(m)}
                    >
                      <FaSignOutAlt />
                      Leave Club
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <dialog ref={leaveDialogRef} className="modal">
        <div className="modal-box">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="font-bold text-lg text-error">Leave Club</h3>
          </div>

          <p className="mb-4">
            Are you sure you want to leave{" "}
            <span className="font-semibold">
              {selectedMembership?.clubName}
            </span>
            ?
          </p>

          <div className="modal-action">
            <button
              className="btn btn-error"
              onClick={handleConfirmLeave}
              disabled={isLeavingClub}
            >
              {isLeavingClub ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Leave"
              )}
            </button>
            <button
              className="btn btn-neutral"
              onClick={closeLeaveModal}
              disabled={isLeavingClub}
            >
              Stay
            </button>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button onClick={closeLeaveModal}>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default JoinedClubs;
