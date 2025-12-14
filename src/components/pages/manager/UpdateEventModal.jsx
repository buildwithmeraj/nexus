import React, { useState, useEffect, useRef } from "react";
import useAxiosSecureInstance from "../../../hooks/useSecureAxiosInstance";
import toast from "react-hot-toast";
import { FaTimes } from "react-icons/fa";

const UpdateEventModal = ({ event, isOpen, onClose, onSuccess }) => {
  const axiosSecure = useAxiosSecureInstance();
  const dialogRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventDate: "",
    location: "",
    isPaid: false,
    eventFee: "",
    maxAttendees: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  /* ---------------- OPEN / CLOSE MODAL ---------------- */
  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  /* ---------------- PREFILL FORM ---------------- */
  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || "",
        description: event.description || "",
        eventDate: event.eventDate
          ? new Date(event.eventDate).toISOString().slice(0, 16)
          : "",
        location: event.location || "",
        isPaid: event.isPaid || false,
        eventFee: event.eventFee || "",
        maxAttendees: event.maxAttendees || "",
      });
    }
  }, [event]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axiosSecure.patch(`/events/${event._id}`, {
        ...formData,
        eventFee: formData.isPaid ? parseFloat(formData.eventFee) : 0,
        maxAttendees: formData.maxAttendees
          ? parseInt(formData.maxAttendees)
          : null,
      });

      toast.success("Event updated successfully");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update event");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box max-w-2xl">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Update Event</h3>
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost"
            disabled={isLoading}
          >
            <FaTimes />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="form-control">
            <label className="label font-semibold">Event Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="input input-bordered"
              required
              disabled={isLoading}
            />
          </div>

          {/* Description */}
          <div className="form-control">
            <label className="label font-semibold">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="textarea textarea-bordered h-24"
              required
              disabled={isLoading}
            />
          </div>

          {/* Date */}
          <div className="form-control">
            <label className="label font-semibold">Date & Time</label>
            <input
              type="datetime-local"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleInputChange}
              className="input input-bordered"
              required
              disabled={isLoading}
            />
          </div>

          {/* Location */}
          <div className="form-control">
            <label className="label font-semibold">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="input input-bordered"
              required
              disabled={isLoading}
            />
          </div>

          {/* Max Attendees */}
          <div className="form-control">
            <label className="label font-semibold">
              Max Attendees
              <span className="label-text-alt">(Optional)</span>
            </label>
            <input
              type="number"
              name="maxAttendees"
              value={formData.maxAttendees}
              onChange={handleInputChange}
              className="input input-bordered"
              min="1"
              disabled={isLoading}
            />
          </div>

          {/* Paid Toggle */}
          <div className="form-control">
            <label className="label cursor-pointer font-semibold">
              Paid Event
              <input
                type="checkbox"
                name="isPaid"
                checked={formData.isPaid}
                onChange={handleInputChange}
                className="checkbox"
                disabled={isLoading}
              />
            </label>
          </div>

          {/* Event Fee */}
          {formData.isPaid && (
            <div className="form-control">
              <label className="label font-semibold">Event Fee ($)</label>
              <input
                type="number"
                name="eventFee"
                value={formData.eventFee}
                onChange={handleInputChange}
                className="input input-bordered"
                min="0"
                step="0.01"
                required
                disabled={isLoading}
              />
            </div>
          )}

          {/* ACTIONS */}
          <div className="modal-action">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Update Event"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* BACKDROP */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default UpdateEventModal;
