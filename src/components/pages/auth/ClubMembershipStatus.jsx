import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecureInstance from "../../../hooks/useSecureAxiosInstance";
import { useAuth } from "../../../contexts/AuthContext";
import toast from "react-hot-toast";
import PaymentModal from "./PaymentModal";

const fetchMembershipStatus = async ({ queryKey }, axiosSecure) => {
  const [, clubId] = queryKey;

  const res = await axiosSecure.get(`/clubs/${clubId}/membership-status`);

  return res.data;
};

export default function ClubMembershipStatus({ clubId, clubFee }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecureInstance();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentType, setPaymentType] = useState(null);

  const {
    data: membership,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["membershipStatus", clubId, user],
    queryFn: (context) => fetchMembershipStatus(context, axiosSecure),
    enabled: !!user && !!clubId,
    retry: false,
  });

  const handleJoinClick = () => {
    setPaymentType("join");
    setShowPaymentModal(true);
  };

  const handleRenewClick = () => {
    setPaymentType("renew");
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    refetch();
    queryClient.invalidateQueries(["membershipStatus", clubId, user]);
    toast.success("Membership activated successfully!");
  };

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
    <>
      <div className="mt-6 p-6 rounded-xl border bg-white shadow-md">
        <h3 className="text-xl font-semibold mb-3">Membership Status</h3>

        <p className="text-gray-700 mb-2">
          Current Status:{" "}
          <span className={`badge ${badgeStyle} badge-lg capitalize`}>
            {status}
          </span>
        </p>

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

        <div className="mt-4 flex gap-3 flex-wrap">
          {status === "none" && (
            <button className="btn btn-primary" onClick={handleJoinClick}>
              {clubFee ? `Join Club ($${clubFee})` : "Join Club"}
            </button>
          )}

          {status === "expired" && (
            <button className="btn btn-warning" onClick={handleRenewClick}>
              {clubFee ? `Renew Membership ($${clubFee})` : "Renew Membership"}
            </button>
          )}

          {status === "pendingPayment" && (
            <button
              className="btn btn-accent"
              onClick={() => {
                setPaymentType("join");
                setShowPaymentModal(true);
              }}
            >
              Complete Payment
            </button>
          )}

          {status === "active" && (
            <button className="btn btn-disabled">Already a Member</button>
          )}
        </div>
      </div>

      {showPaymentModal && (
        <PaymentModal
          clubId={clubId}
          clubFee={clubFee}
          paymentType={paymentType}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
}
