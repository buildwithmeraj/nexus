import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecureInstance from "../../../hooks/useSecureAxiosInstance";
import { useAuth } from "../../../contexts/AuthContext";
import PaymentModal from "./PaymentModal";
import InfoMsg from "../../utilities/Info";
import ErrorMsg from "../../utilities/Error";

const fetchMembershipStatus = async ({ queryKey }, axiosSecure) => {
  const [, clubId] = queryKey;
  const res = await axiosSecure.get(`/clubs/${clubId}/membership-status`);
  return res.data;
};

const STATUS_CONFIG = {
  none: {
    label: "Not Joined",
    badge: "badge-ghost",
    actionLabel: "Join Club",
    actionClass: "btn-primary",
    paymentType: "join",
  },
  expired: {
    label: "Expired",
    badge: "badge-error",
    actionLabel: "Renew Membership",
    actionClass: "btn-warning",
    paymentType: "renew",
  },
  pendingPayment: {
    label: "Pending Payment",
    badge: "badge-warning",
    actionLabel: "Complete Payment",
    actionClass: "btn-accent",
    paymentType: "join",
  },
  active: {
    label: "Active",
    badge: "badge-success",
    actionLabel: "Already a Member",
    disabled: true,
  },
};

export default function ClubMembershipStatus({ clubId, clubFee }) {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecureInstance();
  const queryClient = useQueryClient();

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentType, setPaymentType] = useState(null);

  const {
    data: membership,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["membershipStatus", clubId, user?.email],
    queryFn: (ctx) => fetchMembershipStatus(ctx, axiosSecure),
    enabled: !!user && !!clubId,
    retry: false,
  });

  const openPaymentModal = (type) => {
    setPaymentType(type);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    refetch();
    queryClient.invalidateQueries(["membershipStatus", clubId, user?.email]);
  };

  if (!user) {
    return <InfoMsg message="Login to check your membership status." />;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <span className="loading loading-spinner loading-md text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorMsg
        message={`Failed to load membership status: ${error.message}`}
      />
    );
  }

  if (!membership) return null;

  const { status, joinedAt, expiresAt } = membership;
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.none;

  return (
    <>
      <div className="mt-8 bg-base-100 border rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Membership Status</h3>
          <span className={`badge badge-lg capitalize ${config.badge}`}>
            {config.label}
          </span>
        </div>

        {(joinedAt || expiresAt) && (
          <div className="text-sm text-base-content/80 space-y-1">
            {joinedAt && (
              <p>
                <strong>Joined:</strong>{" "}
                {new Date(joinedAt).toLocaleDateString()}
              </p>
            )}
            {expiresAt && (
              <p>
                <strong>Expires:</strong>{" "}
                {new Date(expiresAt).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        <div className="pt-4 border-t">
          {config.disabled ? (
            <button className="btn btn-disabled w-full">
              {config.actionLabel}
            </button>
          ) : (
            <button
              className={`btn ${config.actionClass} w-full`}
              onClick={() => openPaymentModal(config.paymentType)}
            >
              {clubFee
                ? `${config.actionLabel} ($${clubFee})`
                : config.actionLabel}
            </button>
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
