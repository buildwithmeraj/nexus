import React, { useState } from "react";
import useAxiosSecureInstance from "../../../hooks/useSecureAxiosInstance";
import toast from "react-hot-toast";

const AddEventModal = ({
  isOpen,
  onClose,
  onSuccess,
  clubId = null,
  clubs = [],
}) => {
  const axiosSecure = useAxiosSecureInstance();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventDate: "",
    location: "",
    isPaid: false,
    eventFee: 0,
    maxAttendees: "",
    selectedClubId: clubId || "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.selectedClubId) {
      toast.error("Please select a club");
      return;
    }

    setLoading(true);

    try {
      await axiosSecure.post("/events", {
        title: formData.title,
        description: formData.description,
        eventDate: formData.eventDate,
        location: formData.location,
        isPaid: formData.isPaid,
        eventFee: formData.isPaid ? Number(formData.eventFee) : 0,
        maxAttendees: formData.maxAttendees || null,
        clubId: formData.selectedClubId,
      });

      toast.success("Event created successfully");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg mb-4">Create New Event</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            className="input input-bordered w-full"
            required
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Event Description"
            className="textarea textarea-bordered w-full"
            required
            onChange={handleChange}
          />

          <input
            type="datetime-local"
            name="eventDate"
            className="input input-bordered w-full"
            required
            onChange={handleChange}
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            className="input input-bordered w-full"
            required
            onChange={handleChange}
          />

          {/* Club selector */}
          {clubId ? (
            <input
              type="text"
              disabled
              className="input input-bordered w-full bg-base-200"
              value={`Club ID: ${clubId}`}
            />
          ) : (
            <select
              name="selectedClubId"
              className="select select-bordered w-full"
              value={formData.selectedClubId}
              onChange={handleChange}
              required
            >
              <option value="">Select Club</option>
              {clubs.map((club) => (
                <option key={club._id} value={club._id}>
                  {club.clubName}
                </option>
              ))}
            </select>
          )}

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isPaid"
              className="checkbox"
              onChange={handleChange}
            />
            <label>Paid Event</label>
          </div>

          {formData.isPaid && (
            <input
              type="number"
              name="eventFee"
              placeholder="Event Fee"
              className="input input-bordered w-full"
              min="0"
              step="0.01"
              required
              onChange={handleChange}
            />
          )}

          <input
            type="number"
            name="maxAttendees"
            placeholder="Max Attendees (optional)"
            className="input input-bordered w-full"
            onChange={handleChange}
          />

          <div className="modal-action">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-success"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal;
