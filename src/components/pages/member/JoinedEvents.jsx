import React, { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecureInstance from "../../../hooks/useSecureAxiosInstance";
import { useAuth } from "../../../contexts/AuthContext";
import Loading from "../../utilities/Loading";
import { Link } from "react-router";
import {
  FaCalendar,
  FaMapMarkerAlt,
  FaTrash,
  FaExclamationTriangle,
  FaExternalLinkSquareAlt,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { MdCancel } from "react-icons/md";

const JoinedEvents = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecureInstance();
  const queryClient = useQueryClient();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const {
    data: registrations = [],
    isLoading: isRegistrationsLoading,
    refetch: refetchRegistrations,
  } = useQuery({
    queryKey: ["user-event-registrations", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get("/users/event-registrations");
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Extract unique club IDs
  const clubIds = useMemo(
    () => [...new Set(registrations.map((r) => r.clubId))],
    [registrations]
  );

  // Fetch club details for all unique clubs
  const { data: clubs = {}, isLoading: isClubsLoading } = useQuery({
    queryKey: ["clubs-details", clubIds],
    queryFn: async () => {
      const results = await Promise.all(
        clubIds.map(async (clubId) => {
          const res = await axiosSecure.get(`/clubs/details/${clubId}`);
          return [clubId, res.data.clubName];
        })
      );
      return Object.fromEntries(results);
    },
    enabled: clubIds.length > 0,
  });

  const isLoading = isRegistrationsLoading || isClubsLoading;

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const isEventSoon = (eventDate) => {
    const daysUntilEvent = Math.ceil(
      (new Date(eventDate) - new Date()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilEvent <= 7 && daysUntilEvent > 0;
  };

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
      refetchRegistrations();
      queryClient.invalidateQueries(["user-event-registrations"]);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to cancel registration"
      );
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Events</h1>
        <p className="text-sm mt-1">
          Track your event registrations ({upcomingEvents.length} upcoming)
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Upcoming Events</h2>

        {upcomingEvents.length === 0 ? (
          <div className="bg-base-100 rounded-lg p-12 text-center border-2 border-dashed border-base-300">
            <FaCalendar className="text-4xl mx-auto mb-4" />
            <p className="font-semibold mb-2">No Upcoming Events</p>
            <p className="text-sm mb-4">Register for events to see them here</p>
            <Link to="/events" className="btn btn-primary btn-sm">
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
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
                    const clubName = clubs[reg.clubId] || "Loading...";

                    return (
                      <tr key={reg._id} className="hover:bg-base-200">
                        <td className="font-semibold">{reg.eventTitle}</td>
                        <td>
                          <span className="">{clubName}</span>
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
                            <FaExternalLinkSquareAlt />
                            View
                          </Link>
                          <button
                            className="btn btn-sm btn-error"
                            onClick={() => handleCancelClick(reg)}
                            title="Cancel registration"
                          >
                            <MdCancel size={16} />
                            UnRegister
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="lg:hidden grid grid-cols-1 gap-4">
              {upcomingEvents.map((reg) => {
                const isSoon = isEventSoon(reg.eventDate);
                const clubName = clubs[reg.clubId] || "Loading...";

                return (
                  <div
                    key={reg._id}
                    className="bg-base-100 rounded-lg p-4 border border-base-300 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{reg.eventTitle}</h3>
                        <span className="badge badge-outline badge-sm">
                          {clubName}
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
                          className="text-error shrink-0"
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

      {pastEvents.length > 0 && (
        <div className="space-y-4 mt-8">
          <h2 className="text-2xl font-bold">Past Events</h2>

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
                {pastEvents.map((reg) => {
                  const clubName = clubs[reg.clubId] || "Loading...";

                  return (
                    <tr key={reg._id} className="hover:bg-base-200">
                      <td className="font-semibold">{reg.eventTitle}</td>
                      <td>
                        <span className="">{clubName}</span>
                      </td>
                      <td className="text-sm">
                        <div className="flex items-center gap-2">
                          <FaCalendar size={14} className="text-primary" />
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
                          <FaExternalLinkSquareAlt />
                          View
                        </Link>
                        <button
                          className="btn btn-sm btn-error"
                          onClick={() => handleCancelClick(reg)}
                          title="Cancel registration"
                        >
                          <MdCancel size={16} />
                          UnRegister
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="lg:hidden grid grid-cols-1 gap-4">
            {pastEvents.map((reg) => {
              const clubName = clubs[reg.clubId] || "Loading...";

              return (
                <div
                  key={reg._id}
                  className="bg-base-100 rounded-lg p-4 border border-base-300 shadow-sm opacity-75"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{reg.eventTitle}</h3>
                      <span className="badge badge-outline badge-sm">
                        {clubName}
                      </span>
                    </div>
                    <span className="badge badge-info">Past</span>
                  </div>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <FaCalendar size={14} className="text-primary" />
                      <span>{formatDate(reg.eventDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt
                        size={14}
                        className="text-error shrink-0"
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

      <input
        type="checkbox"
        id="cancel-registration-modal"
        className="modal-toggle"
        checked={showCancelModal}
        onChange={() => setShowCancelModal(false)}
      />
      <div className="modal">
        <div className="modal-box">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-lg font-bold text-error">
              Cancel Registration
            </h3>
          </div>

          <p className="mb-6">
            Are you sure you want to cancel your registration for{" "}
            <span className="font-bold">
              {selectedRegistration?.eventTitle}
            </span>
            ?
          </p>

          <div className="flex items-center justify-end gap-4">
            <div>
              <button
                onClick={handleCancelRegistration}
                className="btn btn-error mr-2"
                disabled={isCancelling}
              >
                {isCancelling ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  "Cancel Registration"
                )}
              </button>
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedRegistration(null);
                }}
                className="btn btn-neutral"
                disabled={isCancelling}
              >
                Keep
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinedEvents;
