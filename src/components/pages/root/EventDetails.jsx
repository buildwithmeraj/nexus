import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../hooks/axiosInstance";
import { useAuth } from "../../../contexts/AuthContext";
import useAxiosSecureInstance from "../../../hooks/useSecureAxiosInstance";
import Loading from "../../utilities/Loading";
import EventRegistrationModal from "./EventRegistrationModal";

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

  // Check if user is already registered
  const { data: registrationStatus, refetch: refetchStatus } = useQuery({
    queryKey: ["userEventRegistration", eventId, user?.email],
    queryFn: async () => {
      if (!user) return false;
      try {
        const res = await axiosSecure.get(`/users/event-registrations`);
        // Find registration for this specific event
        const isRegistered = res.data.some(
          (reg) => reg.eventId === eventId || reg.eventId._id === eventId
        );
        return isRegistered;
      } catch (error) {
        console.error("Error fetching registrations:", error);
        return false;
      }
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

  if (isLoading) return <Loading />;

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Event not found
          </h1>
          <button
            onClick={() => navigate("/events")}
            className="btn btn-primary"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.eventDate);
  const isUpcoming = eventDate > new Date();
  const attendeePercentage = event.maxAttendees
    ? (event.attendeeCount / event.maxAttendees) * 100
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-sm gap-2"
        >
          ← Back
        </button>

        {/* Event Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-secondary h-48 flex items-center justify-center">
            <h1 className="text-4xl font-bold text-white text-center px-4">
              {event.title}
            </h1>
          </div>

          <div className="p-8 space-y-6">
            {/* Event Info Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 font-semibold">DATE</p>
                  <p className="text-2xl font-bold">
                    {eventDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 font-semibold">
                    LOCATION
                  </p>
                  <p className="text-lg font-semibold">{event.location}</p>
                </div>
              </div>

              <div className="space-y-4">
                {event.isPaid && (
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">COST</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${event.eventFee}
                    </p>
                  </div>
                )}

                {!event.isPaid && (
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">COST</p>
                    <p className="text-2xl font-bold text-green-600">FREE</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-600 font-semibold">
                    ATTENDEES
                  </p>
                  <p className="text-lg font-semibold">
                    {event.attendeeCount}
                    {event.maxAttendees ? `/${event.maxAttendees}` : "+"}
                  </p>
                </div>
              </div>
            </div>

            {/* Attendee Progress */}
            {event.maxAttendees && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-600">Capacity</p>
                  <p className="text-sm font-semibold">
                    {attendeePercentage.toFixed(0)}%
                  </p>
                </div>
                <progress
                  className="progress progress-primary w-full"
                  value={attendeePercentage}
                  max="100"
                />
              </div>
            )}

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold mb-4">About This Event</h2>
              <p className="text-gray-700 leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Status & Actions */}
            <div className="pt-6 border-t space-y-4">
              {isUpcoming ? (
                <>
                  {registrationStatus ? (
                    <div className="alert alert-success">
                      <span>✓ You are registered for this event</span>
                    </div>
                  ) : event.maxAttendees &&
                    event.attendeeCount >= event.maxAttendees ? (
                    <div className="alert alert-warning">
                      <span>This event is at full capacity</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleRegisterClick}
                      className="btn btn-primary btn-lg w-full"
                    >
                      {event.isPaid
                        ? `Register & Pay $${event.eventFee}`
                        : "Register for Event"}
                    </button>
                  )}
                </>
              ) : (
                <div className="alert">
                  <span>This event has already passed</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
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
