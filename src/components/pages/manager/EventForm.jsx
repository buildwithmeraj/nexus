import React, { useState, forwardRef } from "react";
import { useMutation } from "@tanstack/react-query";
import useAxiosSecureInstance from "../../../hooks/useSecureAxiosInstance";
import toast from "react-hot-toast";

const EventForm = forwardRef(({ clubId, event, onClose, onSuccess }, ref) => {
  const axiosSecure = useAxiosSecureInstance();
  const [formData, setFormData] = useState({
    title: event?.title || "",
    description: event?.description || "",
    eventDate: event?.eventDate
      ? new Date(event.eventDate).toISOString().split("T")[0]
      : "",
    location: event?.location || "",
    isPaid: event?.isPaid || false,
    eventFee: event?.eventFee || 0,
    maxAttendees: event?.maxAttendees || "",
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosSecure.post(`/clubs/${clubId}/events`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Event created successfully");
      handleCloseModal();
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create event");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosSecure.patch(`/events/${event._id}`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Event updated successfully");
      handleCloseModal();
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update event");
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !formData.eventDate ||
      !formData.location
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (formData.isPaid && !formData.eventFee) {
      toast.error("Please enter event fee");
      return;
    }

    if (event) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleCloseModal = () => {
    ref?.current?.close();
    onClose();
  };

  const isLoading = createMutation.isLoading || updateMutation.isLoading;

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box w-full max-w-lg">
        <form method="dialog">
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={handleCloseModal}
          >
            ✕
          </button>
        </form>

        <h3 className="font-bold text-lg mb-4">
          {event ? "Edit Event" : "Create New Event"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="label">
              <span className="label-text font-semibold">Event Title *</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="e.g., Annual Tech Meetup"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="label">
              <span className="label-text font-semibold">Description *</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
              placeholder="Event details..."
              rows="3"
              required
            />
          </div>

          {/* Event Date */}
          <div>
            <label className="label">
              <span className="label-text font-semibold">Event Date *</span>
            </label>
            <input
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="label">
              <span className="label-text font-semibold">Location *</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="e.g., Conference Hall A"
              required
            />
          </div>

          {/* Max Attendees */}
          <div>
            <label className="label">
              <span className="label-text font-semibold">
                Max Attendees (Optional)
              </span>
            </label>
            <input
              type="number"
              name="maxAttendees"
              value={formData.maxAttendees}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Leave empty for unlimited"
              min="1"
            />
          </div>

          {/* Paid Event Toggle */}
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text font-semibold">Paid Event?</span>
              <input
                type="checkbox"
                name="isPaid"
                checked={formData.isPaid}
                onChange={handleChange}
                className="checkbox"
              />
            </label>
          </div>

          {/* Event Fee */}
          {formData.isPaid && (
            <div>
              <label className="label">
                <span className="label-text font-semibold">
                  Event Fee ($) *
                </span>
              </label>
              <input
                type="number"
                name="eventFee"
                value={formData.eventFee}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="0.00"
                min="0"
                step="0.01"
                required={formData.isPaid}
              />
            </div>
          )}

          {/* Buttons */}
          <div className="modal-action">
            <button
              type="button"
              onClick={handleCloseModal}
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
              {isLoading
                ? "Saving..."
                : event
                ? "Update Event"
                : "Create Event"}
            </button>
          </div>
        </form>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={handleCloseModal}>
          close
        </button>
      </form>
    </dialog>
  );
});

EventForm.displayName = "EventForm";

export default EventForm;
