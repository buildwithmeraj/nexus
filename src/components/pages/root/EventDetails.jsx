import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../hooks/axiosInstance";
import { useAuth } from "../../../contexts/AuthContext";
import useAxiosSecureInstance from "../../../hooks/useSecureAxiosInstance";
import EventRegistrationModal from "./EventRegistrationModal";
import SuccessMsg from "../../utilities/Success";
import WarningMsg from "../../utilities/Warning";
import { FaCalendar, FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import EventCard from "../../shared/EventCard";
import Loading from "../../utilities/Loading";
import { useEffect } from "react";

export default function EventDetails() {
  const { id: eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecureInstance();
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  // Fetch event details
  const {
    data: event,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["eventDetails", eventId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/events/${eventId}`);
      return res.data;
    },
  });

  // Fetch same-club events
  const { data: sameClubEvents = [] } = useQuery({
    queryKey: ["same-club-events", event?.clubId, eventId],
    enabled: !!event?.clubId && !!eventId,
    queryFn: async () => {
      const res = await axiosInstance.get(`/clubs/${event.clubId}/events`);

      return res.data.filter((e) => String(e._id) !== String(eventId));
    },
  });

  // Registration status
  const {
    data: registrationStatus,
    isLoading: isCheckingRegistration,
    refetch: refetchStatus,
  } = useQuery({
    queryKey: ["userEventRegistration", eventId, user?.email],
    queryFn: async () => {
      if (!user) return false;
      const res = await axiosSecure.get(
        `/member/event-registrations/${eventId}`
      );
      return res.data.isRegistered || false;
    },
    enabled: !!user && !!eventId,
  });

  const handleRegisterClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setShowRegistrationModal(true);
  };

  const handleRegistrationSuccess = () => {
    setShowRegistrationModal(false);
    refetchStatus();
  };

  useEffect(() => {}, [eventId]);

  if (isLoading) return <Loading />;

  if (isError) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-error">Event not found</h1>
        <button
          onClick={() => navigate("/events")}
          className="btn btn-primary mt-4"
        >
          Back to Events
        </button>
      </div>
    );
  }

  const eventDate = new Date(event.eventDate);
  const isUpcoming = eventDate > new Date();
  const attendeePercentage = event.maxAttendees
    ? (event.attendeeCount / event.maxAttendees) * 100
    : 0;

  return (
    <div className="">
      <div className="max-w-5xl mx-auto px-4 space-y-6">
        <div className="card bg-base-100 shadow-xl rounded-xl">
          <div className="card-body space-y-4">
            <h1 className="text-4xl font-bold text-center">{event.title}</h1>

            <div>
              <h2 className="text-xl font-semibold mb-2">About this event</h2>
              <p className="text-base-content/80">{event.description}</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-2 justify-items-stretch">
              <div className="flex items-center gap-2">
                <FaCalendar className="text-primary" />
                {eventDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="flex items-center md:justify-end lg:justify-center gap-2">
                <FaMapMarkerAlt className="text-error" />
                {event.location}
              </div>

              <div className="font-semibold flex items-center lg:justify-center gap-2">
                Cost:{" "}
                <span className="text-success">
                  {event.isPaid ? `$${event.eventFee}` : "FREE"}
                </span>
              </div>
              <div className="flex items-center md:justify-end gap-2">
                <FaUsers />
                {event.attendeeCount}
                {event.maxAttendees &&
                  ` / ${event.maxAttendees ? event.maxAttendees : "∞"}`}
              </div>
            </div>

            {event.maxAttendees && (
              <progress
                className="progress progress-primary w-full"
                value={attendeePercentage}
                max="100"
              />
            )}

            <div className="pt-2">
              {isUpcoming ? (
                isCheckingRegistration ? (
                  <div className="flex items-center justify-center gap-2 py-3">
                    <span className="loading loading-spinner loading-sm"></span>
                    <span className="text-sm text-base-content/70">
                      Checking registration status...
                    </span>
                  </div>
                ) : registrationStatus ? (
                  <SuccessMsg message="You are registered for this event" />
                ) : (
                  <button
                    onClick={handleRegisterClick}
                    className="btn btn-primary w-full"
                  >
                    {event.isPaid
                      ? `Register & Pay $${event.eventFee}`
                      : "Register for Event"}
                  </button>
                )
              ) : (
                <WarningMsg message="This event has already passed" />
              )}
            </div>

            <div className="flex justify-center gap-3">
              <Link to={`/clubs/${event.clubId}`} className="btn btn-outline">
                View Club
              </Link>
              <Link to="/events" className="btn btn-primary">
                All Events
              </Link>
            </div>
          </div>
        </div>

        {sameClubEvents.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">
              Explore events from this club
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sameClubEvents.map((ev) => (
                <EventCard key={ev._id} event={ev} />
              ))}
            </div>
          </div>
        )}
      </div>

      {showRegistrationModal && (
        <EventRegistrationModal
          eventId={eventId}
          eventTitle={event.title}
          eventFee={event.eventFee}
          isPaid={event.isPaid}
          onClose={() => setShowRegistrationModal(false)}
          onSuccess={handleRegistrationSuccess}
        />
      )}
    </div>
  );
}
