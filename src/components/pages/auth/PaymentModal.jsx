import React, { useState, useEffect } from "react";
import useAxiosSecureInstance from "../../../hooks/useSecureAxiosInstance";
import toast from "react-hot-toast";

export default function PaymentModal({
  clubId,
  clubFee,
  paymentType,
  onClose,
  onSuccess,
}) {
  const axiosSecure = useAxiosSecureInstance();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializePayment = async () => {
      try {
        setLoading(true);
        setError(null);

        if (clubFee === 0 || !clubFee) {
          // Free membership
          const endpoint =
            paymentType === "join"
              ? `/clubs/${clubId}/join`
              : `/clubs/${clubId}/renew-membership`;

          await axiosSecure.post(endpoint, {});
          onSuccess();
          onClose();
          return;
        }

        // Paid membership - create checkout session
        const endpoint =
          paymentType === "join"
            ? `/clubs/${clubId}/create-checkout-session`
            : `/clubs/${clubId}/create-renewal-session`;

        const res = await axiosSecure.post(endpoint, {});

        if (res.data.url) {
          // Redirect to Stripe-hosted checkout
          window.location.href = res.data.url;
        }
      } catch (error) {
        console.error(error);
        setError(
          error.response?.data?.message || "Failed to initialize payment"
        );
        toast.error("Failed to initialize payment");
      } finally {
        setLoading(false);
      }
    };

    initializePayment();
  }, [clubId, clubFee, paymentType, axiosSecure, onClose, onSuccess]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
          <p className="text-center mt-4">Redirecting to payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 className="text-lg font-bold text-red-600 mb-4">Payment Error</h3>
          <p className="text-gray-700 mb-6">{error}</p>
          <button onClick={onClose} className="btn btn-primary w-full">
            Close
          </button>
        </div>
      </div>
    );
  }

  if (clubFee === 0 || !clubFee) {
    return null;
  }

  return null;
}
