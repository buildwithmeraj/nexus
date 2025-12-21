import React, { useEffect, useRef, useState } from "react";
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
  const [loading, setLoading] = useState(true);
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const registerForEvent = async () => {
      try {
        if (!isPaid || eventFee === 0) {
          await axiosSecure.post(`/events/${eventId}/register`);
          toast.success("Successfully registered!");
          onSuccess();
          onClose();
          return;
        }

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
        onClose();
      } finally {
        setLoading(false);
      }
    };

    registerForEvent();
  }, [eventId, eventFee, isPaid, axiosSecure, onClose, onSuccess]);

  if (!loading) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box text-center">
        <span className="loading loading-spinner loading-lg text-primary mb-4" />
        <p className="text-lg font-semibold">
          {isPaid && eventFee > 0
            ? "Redirecting to payment..."
            : "Registering..."}
        </p>
      </div>

      <div className="modal-backdrop" />
    </dialog>
  );
}
