import React, { useState, useEffect } from "react";
import useAxiosSecureInstance from "../../../hooks/useSecureAxiosInstance";
import toast from "react-hot-toast";

export default function EventRegistrationModal({
  eventId,
  //eventTitle,
  eventFee,
  isPaid,
  onClose,
  onSuccess,
}) {
  const axiosSecure = useAxiosSecureInstance();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const registerForEvent = async () => {
      try {
        setLoading(true);
        setError(null);

        // If free event, register directly
        if (!isPaid || eventFee === 0) {
          await axiosSecure.post(`/events/${eventId}/register`, {});
          toast.success("Successfully registered!");
          onSuccess();
          onClose();
          return;
        }

        // For paid events, create checkout session
        const res = await axiosSecure.post(
          `/events/${eventId}/create-registration-session`,
          {}
        );

        if (res.data.url) {
          window.location.href = res.data.url;
        }
      } catch (error) {
        console.error(error);
        const errorMsg =
          error.response?.data?.message || "Failed to register for event";
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    registerForEvent();
  }, [eventId, eventFee, isPaid, axiosSecure, onClose, onSuccess]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-8 max-w-md w-full">
          <div className="flex justify-center mb-4">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
          <p className="text-center text-lg font-semibold">
            {isPaid && eventFee > 0
              ? "Redirecting to payment..."
              : "Registering..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-8 max-w-md w-full">
          <h3 className="text-lg font-bold text-red-600 mb-4">
            Registration Error
          </h3>
          <p className="text-gray-700 mb-6">{error}</p>
          <button onClick={onClose} className="btn btn-primary w-full">
            Close
          </button>
        </div>
      </div>
    );
  }

  return null;
}
