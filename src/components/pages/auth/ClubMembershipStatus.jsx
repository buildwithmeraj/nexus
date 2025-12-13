import React from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../hooks/axiosInstance";
import { useAuth } from "../../../contexts/AuthContext";
import useAxiosSecureInstance from "../../../hooks/useSecureAxiosInstance";

const fetchMembershipStatus = async ({ queryKey }) => {
  const [, clubId, user] = queryKey;

  if (!user) return null;

  const token = await user.getIdToken();

  const res = await axiosInstance.get(`/clubs/${clubId}/membership-status`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

const joinClub = async () => {
  try {
    axiosSecure = useAxiosSecureInstance();
    const token = await user.getIdToken();

    const res = await axiosInstance.post(
      `/clubs/${clubId}/join`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Refetch membership status after joining
    queryClient.invalidateQueries(["membershipStatus", clubId, user]);

    alert(res.data.message || "Joined successfully");
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Failed to join club");
  }
};

export default function ClubMembershipStatus({ clubId }) {
  const { user } = useAuth();

  const {
    data: membership,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["membershipStatus", clubId, user],
    queryFn: fetchMembershipStatus,
    enabled: !!user && !!clubId,
    retry: false,
  });

  if (!user) {
    return (
      <div className="mt-4 p-4 bg-gray-100 rounded-lg text-gray-600">
        Login to check your membership status.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mt-4 p-4 flex justify-center">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
        Failed to load membership status: {error.message}
      </div>
    );
  }

  if (!membership) {
    return null;
  }

  const { status } = membership;

  const badgeStyle =
    status === "active"
      ? "badge-success"
      : status === "expired"
      ? "badge-error"
      : status === "pendingPayment"
      ? "badge-warning"
      : "badge-ghost";

  return (
    <div className="mt-6 p-6 rounded-xl border bg-white shadow-md">
      <h3 className="text-xl font-semibold mb-3">Membership Status</h3>

      <p className="text-gray-700 mb-2">
        Current Status:{" "}
        <span className={`badge ${badgeStyle} badge-lg capitalize`}>
          {status}
        </span>
      </p>

      {/* Optional details */}
      {membership.joinedAt && (
        <p className="text-sm text-gray-600">
          Joined: {new Date(membership.joinedAt).toLocaleDateString()}
        </p>
      )}

      {membership.expiresAt && (
        <p className="text-sm text-gray-600">
          Expires: {new Date(membership.expiresAt).toLocaleDateString()}
        </p>
      )}

      <div className="mt-4 flex gap-3">
        {status === "none" && (
          <button className="btn btn-primary">Join Club</button>
        )}

        {status === "expired" && (
          <button className="btn btn-warning">Renew Membership</button>
        )}

        {status === "pendingPayment" && (
          <button className="btn btn-accent">Complete Payment</button>
        )}

        {status === "active" && (
          <button className="btn btn-disabled">Already a Member</button>
        )}
      </div>
    </div>
  );
}
