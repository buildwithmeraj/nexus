import React, { useState, useEffect, useRef } from "react";
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
  const dialogRef = useRef(null);
  const hasInitialized = useRef(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    dialogRef.current?.showModal();
    return () => dialogRef.current?.close();
  }, []);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initializePayment = async () => {
      try {
        setLoading(true);
        setError(null);

        // Free membership handling
        if (!clubFee || clubFee === 0) {
          const endpoint =
            paymentType === "join"
              ? `/clubs/${clubId}/join`
              : `/clubs/${clubId}/renew-membership`;

          const res = await axiosSecure.post(endpoint);
          console.log("Free membership response:", res.data);
          toast.success("Membership successful");
          onSuccess();
          onClose();
          return;
        }

        // Paid membership handling
        const endpoint =
          paymentType === "join"
            ? `/clubs/${clubId}/create-checkout-session`
            : `/clubs/${clubId}/create-renewal-session`;

        console.log("Calling endpoint:", endpoint);
        const res = await axiosSecure.post(endpoint);

        console.log("Checkout session response:", res.data);

        if (res.data?.url) {
          console.log("Redirecting to Stripe:", res.data.url);
          window.location.assign(res.data.url);
        } else {
          throw new Error("No checkout URL returned");
        }
      } catch (err) {
        console.error("Payment initialization error:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to initialize payment"
        );
        toast.error("Failed to initialize payment");
      } finally {
        setLoading(false);
      }
    };

    initializePayment();
  }, [clubId, clubFee, paymentType, axiosSecure, onClose, onSuccess]);

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box max-w-md">
        {loading && (
          <div className="text-center space-y-4">
            <span className="loading loading-spinner loading-lg text-primary" />
            <p className="text-sm text-gray-600">
              Redirecting to payment page...
            </p>
          </div>
        )}

        {!loading && error && (
          <>
            <h3 className="text-lg font-bold text-red-600 mb-4">
              Payment Error
            </h3>
            <p className="text-gray-700 mb-6">{error}</p>
            <div className="modal-action">
              <button onClick={onClose} className="btn btn-primary w-full">
                Close
              </button>
            </div>
          </>
        )}
      </div>

      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
