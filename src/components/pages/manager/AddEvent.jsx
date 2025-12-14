import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecureInstance from "../../../hooks/useSecureAxiosInstance";
import { useAuth } from "../../../contexts/AuthContext";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";
import Loading from "../../utilities/Loading";

const AddEvent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecureInstance();
  const searchParams = new URLSearchParams(window.location.search);
  const preSelectedClubId = searchParams.get("clubId");

  const [formData, setFormData] = useState({
    clubId: preSelectedClubId || "",
    title: "",
    description: "",
    eventDate: "",
    location: "",
    isPaid: false,
    eventFee: "",
    maxAttendees: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch clubs managed by user
  const { data: clubs = [], isLoading: clubsLoading } = useQuery({
    queryKey: ["manager-clubs"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/clubs/${user?.email}`);
      return res.data;
    },
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.clubId) {
      toast.error("Please select a club");
      return;
    }

    setIsLoading(true);

    try {
      await axiosSecure.post(`/clubs/${formData.clubId}/events`, {
        title: formData.title,
        description: formData.description,
        eventDate: formData.eventDate,
        location: formData.location,
        isPaid: formData.isPaid,
        eventFee: formData.isPaid ? parseFloat(formData.eventFee) : 0,
        maxAttendees: formData.maxAttendees
          ? parseInt(formData.maxAttendees)
          : null,
      });

      toast.success("Event created successfully");
      navigate("/dashboard/manager/events");
    } catch (error) {
      console.error("Creation failed:", error);
      toast.error(error.response?.data?.message || "Failed to create event");
    } finally {
      setIsLoading(false);
    }
  };

  if (clubsLoading) return <Loading />;

  if (clubs.length === 0) {
    return (
      <div className="bg-base-100 rounded-lg p-12 text-center border-2 border-dashed border-base-300">
        <p className="text-gray-500 font-semibold mb-2">No Clubs Found</p>
        <p className="text-gray-400 text-sm">
          You need to create a club before you can add events
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/dashboard/manager/events")}
          className="btn btn-ghost btn-circle btn-sm"
        >
          <FaArrowLeft size={18} />
        </button>
        <h1 className="text-3xl font-bold">Create New Event</h1>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-base-100 rounded-lg p-6 border border-base-300"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Select Club */}
          <div className="space-y-3">
            <div className="form-control">
              <label className="label block">
                <span className="label-text font-semibold">Select Club</span>
              </label>
              <select
                name="clubId"
                value={formData.clubId}
                onChange={handleInputChange}
                className="select select-bordered"
                required
                disabled={isLoading}
              >
                <option value="">Choose a club...</option>
                {clubs.map((club) => (
                  <option key={club._id} value={club._id}>
                    {club.clubName}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div className="form-control">
              <label className="label block">
                <span className="label-text font-semibold">Event Title</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter event title"
                className="input input-bordered"
                required
                disabled={isLoading}
              />
            </div>

            {/* Location */}
            <div className="form-control">
              <label className="label block">
                <span className="label-text font-semibold">Location</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter event location"
                className="input input-bordered"
                required
                disabled={isLoading}
              />
            </div>

            {/* Date & Time */}
            <div className="form-control md:col-span-2">
              <label className="label block">
                <span className="label-text font-semibold">Date & Time</span>
              </label>
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
          </div>
          <div className="space-y-3">
            {/* Description */}
            <div className="form-control md:col-span-2">
              <label className="label block">
                <span className="label-text font-semibold">Description</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter event description"
                className="textarea textarea-bordered h-20"
                required
                disabled={isLoading}
              ></textarea>
            </div>
            {/* Max Attendees */}
            <div className="form-control">
              <label className="label block flex items-center gap-2">
                <span className="label-text font-semibold">Max Attendees</span>
                <span className="label-text-alt text-gray-500">(Optional)</span>
              </label>
              <input
                type="number"
                name="maxAttendees"
                value={formData.maxAttendees}
                onChange={handleInputChange}
                placeholder="Leave empty for unlimited"
                className="input input-bordered"
                min="1"
                disabled={isLoading}
              />
            </div>

            {/* Paid Event Toggle */}
            <div className="form-control">
              <label className="label cursor-pointer">
                <input
                  type="checkbox"
                  name="isPaid"
                  checked={formData.isPaid}
                  onChange={handleInputChange}
                  className="checkbox"
                  disabled={isLoading}
                />
                <span className="label-text font-semibold">Paid Event</span>
              </label>
            </div>

            {/* Event Fee */}
            {formData.isPaid && (
              <div className="form-control">
                <label className="label block">
                  <span className="label-text font-semibold">
                    Event Fee ($)
                  </span>
                </label>
                <input
                  type="number"
                  name="eventFee"
                  value={formData.eventFee}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="input input-bordered"
                  step="0.01"
                  min="0"
                  required={formData.isPaid}
                  disabled={isLoading}
                />
              </div>
            )}
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-4 mt-4 border-t border-base-300 justify-end lg:px-24">
          <button
            type="button"
            onClick={() => navigate("/dashboard/manager/events")}
            className="btn btn-ghost"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary "
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              "Create Event"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEvent;
