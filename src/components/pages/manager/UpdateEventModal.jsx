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

  useEffect(() => {
    if (isOpen) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [isOpen]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axiosSecure.patch(`/events/${event._id}`, {
        ...formData,
        eventFee: formData.isPaid ? Number(formData.eventFee) : 0,
        maxAttendees: formData.maxAttendees
          ? Number(formData.maxAttendees)
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
      <div className="modal-box max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Update Event</h3>
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost"
            disabled={isLoading}
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Event Title</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Date & Time</span>
                </label>
                <input
                  type="datetime-local"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Location</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="form-control">
                <label className="label cursor-pointer justify-between mt-3">
                  <span className="label-text">Paid Event</span>
                  <input
                    type="checkbox"
                    name="isPaid"
                    checked={formData.isPaid}
                    onChange={handleInputChange}
                    className="toggle toggle-primary"
                    disabled={isLoading}
                  />
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered w-full min-h-[120px]"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">
                    Max Attendees
                    <span className="text-xs text-gray-400 ml-1">
                      (Optional)
                    </span>
                  </span>
                </label>
                <input
                  type="number"
                  name="maxAttendees"
                  value={formData.maxAttendees}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  min="1"
                  disabled={isLoading}
                />
              </div>

              {formData.isPaid && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Event Fee ($)</span>
                  </label>
                  <input
                    type="number"
                    name="eventFee"
                    value={formData.eventFee}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    min="0"
                    step="0.01"
                    required
                    disabled={isLoading}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="modal-action flex flex-col sm:flex-row gap-3 justify-end">
            <div>
              <button
                type="submit"
                className="btn btn-primary flex-1 mr-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  "Update Event"
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn flex-1"
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default UpdateEventModal;
