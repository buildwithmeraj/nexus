import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecureInstance from "../../../hooks/useSecureAxiosInstance";
import { useAuth } from "../../../contexts/AuthContext";
import Loading from "../../utilities/Loading";
import { Link } from "react-router";
import {
  FaCalendar,
  FaMapMarkerAlt,
  FaDollarSign,
  FaUsers,
  FaTrash,
  FaExclamationTriangle,
} from "react-icons/fa";
import toast from "react-hot-toast";

const JoinedEvents = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecureInstance();
  const queryClient = useQueryClient();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // Fetch user's event registrations
  const {
    data: registrations = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user-event-registrations", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get("/users/event-registrations");
      return res.data;
    },
  });

  // Separate upcoming and past events
  const upcomingEvents = registrations.filter(
    (reg) => new Date(reg.eventDate) > new Date()
  );
  const pastEvents = registrations.filter(
    (reg) => new Date(reg.eventDate) <= new Date()
  );

  const handleCancelClick = (registration) => {
    setSelectedRegistration(registration);
    setShowCancelModal(true);
  };

  const handleCancelRegistration = async () => {
    if (!selectedRegistration) return;

    setIsCancelling(true);
    try {
      await axiosSecure.delete(
        `/event-registrations/${selectedRegistration._id}`
      );
      toast.success("Registration cancelled successfully");
      setShowCancelModal(false);
      setSelectedRegistration(null);
      refetch();
      queryClient.invalidateQueries(["user-event-registrations"]);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to cancel registration"
      );
    } finally {
      setIsCancelling(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isEventSoon = (eventDate) => {
    const daysUntilEvent = Math.ceil(
      (new Date(eventDate) - new Date()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilEvent <= 7 && daysUntilEvent > 0;
  };

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">My Events</h1>
        <p className="text-gray-600 text-sm mt-1">
          Track your event registrations ({upcomingEvents.length} upcoming)
        </p>
      </div>

      {/* Upcoming Events */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Upcoming Events</h2>

        {upcomingEvents.length === 0 ? (
          <div className="bg-base-100 rounded-lg p-12 text-center border-2 border-dashed border-base-300">
            <FaCalendar className="text-4xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 font-semibold mb-2">
              No Upcoming Events
            </p>
            <p className="text-gray-400 text-sm mb-4">
              Register for events to see them here
            </p>
            <Link to="/events" className="btn btn-primary btn-sm">
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Event Title</th>
                    <th>Club</th>
                    <th>Date & Time</th>
                    <th>Location</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingEvents.map((reg) => {
                    const isSoon = isEventSoon(reg.eventDate);

                    return (
                      <tr key={reg._id} className="hover:bg-base-200">
                        <td className="font-semibold">{reg.eventTitle}</td>
                        <td>
                          <span className="badge badge-outline">
                            {reg.clubName}
                          </span>
                        </td>
                        <td className="text-sm">
                          <div className="flex items-center gap-2">
                            <FaCalendar
                              size={14}
                              className={
                                isSoon ? "text-warning" : "text-primary"
                              }
                            />
                            {formatDate(reg.eventDate)}
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <FaMapMarkerAlt size={14} className="text-error" />
                            <span className="text-sm">{reg.eventLocation}</span>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              reg.isPaid ? "badge-warning" : "badge-success"
                            }`}
                          >
                            {reg.isPaid ? "Paid" : "Free"}
                          </span>
                        </td>
                        <td>
                          <span className="badge badge-info">{reg.status}</span>
                        </td>
                        <td className="flex gap-2">
                          <Link
                            to={`/events/${reg.eventId}`}
                            className="btn btn-sm btn-primary"
                          >
                            View
                          </Link>
                          <button
                            className="btn btn-sm btn-ghost text-error"
                            onClick={() => handleCancelClick(reg)}
                            title="Cancel registration"
                          >
                            <FaTrash size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden grid grid-cols-1 gap-4">
              {upcomingEvents.map((reg) => {
                const isSoon = isEventSoon(reg.eventDate);

                return (
                  <div
                    key={reg._id}
                    className="bg-base-100 rounded-lg p-4 border border-base-300 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{reg.eventTitle}</h3>
                        <span className="badge badge-outline badge-sm">
                          {reg.clubName}
                        </span>
                      </div>
                      <span
                        className={`badge ${
                          isSoon ? "badge-warning" : "badge-info"
                        }`}
                      >
                        {isSoon ? "Soon!" : "Registered"}
                      </span>
                    </div>

                    {isSoon && (
                      <div className="alert alert-warning alert-sm mb-3">
                        <FaExclamationTriangle size={14} />
                        <span className="text-sm">Event coming up soon!</span>
                      </div>
                    )}

                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <FaCalendar
                          size={14}
                          className={isSoon ? "text-warning" : "text-primary"}
                        />
                        <span>{formatDate(reg.eventDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt
                          size={14}
                          className="text-error flex-shrink-0"
                        />
                        <span>{reg.eventLocation}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`badge ${
                            reg.isPaid ? "badge-warning" : "badge-success"
                          }`}
                        >
                          {reg.isPaid ? "Paid Event" : "Free Event"}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to={`/events/${reg.eventId}`}
                        className="btn btn-sm btn-primary flex-1"
                      >
                        View Event
                      </Link>
                      <button
                        className="btn btn-sm btn-error gap-1"
                        onClick={() => handleCancelClick(reg)}
                      >
                        <FaTrash size={12} />
                        Cancel
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Past Events</h2>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="table w-full opacity-75">
              <thead>
                <tr>
                  <th>Event Title</th>
                  <th>Club</th>
                  <th>Date & Time</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pastEvents.map((reg) => (
                  <tr key={reg._id} className="hover:bg-base-200">
                    <td className="font-semibold">{reg.eventTitle}</td>
                    <td>
                      <span className="badge badge-outline">
                        {reg.clubName}
                      </span>
                    </td>
                    <td className="text-sm">
                      <div className="flex items-center gap-2">
                        <FaCalendar size={14} className="text-gray-400" />
                        {formatDate(reg.eventDate)}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt size={14} className="text-error" />
                        <span className="text-sm">{reg.eventLocation}</span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          reg.isPaid ? "badge-warning" : "badge-success"
                        }`}
                      >
                        {reg.isPaid ? "Paid" : "Free"}
                      </span>
                    </td>
                    <td>
                      <Link
                        to={`/events/${reg.eventId}`}
                        className="btn btn-sm btn-ghost"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden grid grid-cols-1 gap-4">
            {pastEvents.map((reg) => (
              <div
                key={reg._id}
                className="bg-base-100 rounded-lg p-4 border border-base-300 shadow-sm opacity-75"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{reg.eventTitle}</h3>
                    <span className="badge badge-outline badge-sm">
                      {reg.clubName}
                    </span>
                  </div>
                  <span className="badge">Completed</span>
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <FaCalendar size={14} className="text-gray-400" />
                    <span>{formatDate(reg.eventDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt
                      size={14}
                      className="text-error flex-shrink-0"
                    />
                    <span>{reg.eventLocation}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`badge ${
                        reg.isPaid ? "badge-warning" : "badge-success"
                      }`}
                    >
                      {reg.isPaid ? "Paid Event" : "Free Event"}
                    </span>
                  </div>
                </div>

                <Link
                  to={`/events/${reg.eventId}`}
                  className="btn btn-sm btn-ghost w-full"
                >
                  View Event
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cancel Registration Modal */}
      {showCancelModal && selectedRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <FaExclamationTriangle className="text-warning text-2xl" />
              <h3 className="text-lg font-bold">Cancel Registration</h3>
            </div>

            <p className="text-gray-700">
              Are you sure you want to cancel your registration for{" "}
              <span className="font-bold">
                {selectedRegistration.eventTitle}
              </span>
              ?
            </p>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedRegistration(null);
                }}
                className="btn btn-ghost flex-1"
                disabled={isCancelling}
              >
                Keep Registration
              </button>
              <button
                onClick={handleCancelRegistration}
                className="btn btn-error flex-1"
                disabled={isCancelling}
              >
                {isCancelling ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  "Cancel Registration"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinedEvents;
