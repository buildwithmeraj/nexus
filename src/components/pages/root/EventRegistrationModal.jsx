import React, { useState, useEffect, useRef } from "react";
import useAxiosSecureInstance from "../../../hooks/useSecureAxiosInstance";
import toast from "react-hot-toast";

export default function EventRegistrationModal({
  eventId,
  eventFee,
  isPaid,
  onClose,
  onSuccess,
}) {
  const axiosSecure = useAxiosSecureInstance();
  const [loading, setLoading] = useState(false);
  const hasRunRef = useRef(false); // 👈 IMPORTANT

  useEffect(() => {
    if (hasRunRef.current) return; // prevent double call
    hasRunRef.current = true;

    const registerForEvent = async () => {
      try {
        setLoading(true);

        // Free event
        if (!isPaid || eventFee === 0) {
          await axiosSecure.post(`/events/${eventId}/register`);
          toast.success("Successfully registered!");
          onSuccess();
          onClose();
          return;
        }

        // Paid event
        const res = await axiosSecure.post(
          `/events/${eventId}/create-registration-session`
        );

        if (res.data?.url) {
          window.location.href = res.data.url;
        }
      } catch (error) {
        const errorMsg =
          error.response?.data?.message || "Failed to register for event";
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    registerForEvent();
  }, [eventId, eventFee, isPaid, axiosSecure, onClose, onSuccess]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-lg p-8 max-w-md w-full">
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
