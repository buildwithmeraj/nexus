import React from "react";
import {
  FaCalendar,
  FaMapMarkerAlt,
  FaUsers,
  FaDollarSign,
} from "react-icons/fa";
import { Link } from "react-router";
import AnimatedCard from "../animations/AnimatedCard";

const EventCard = ({ event }) => {
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const isPast = new Date(event.eventDate) < new Date();

  return (
    <AnimatedCard className="card bg-base-200 shadow-xl rounded-xl">
      <div className="card-body space-y-3">
        <div className="flex justify-between items-start gap-2">
          <h3 className="card-title text-lg">{event.title}</h3>
          <span
            className={`badge badge-sm ${
              event.isPaid ? "badge-warning" : "badge-success"
            }`}
          >
            {event.isPaid ? "Paid" : "Free"}
          </span>
        </div>

        <div className="space-y-2 text-sm text-base-content/70">
          <div className="flex items-center gap-2">
            <FaCalendar className="text-primary" />
            <span>{formatDate(event.eventDate)}</span>
          </div>

          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-secondary" />
            <span>{event.location}</span>
          </div>

          <div className="flex items-center gap-2">
            <FaUsers className="text-info" />
            <span>
              {event.attendeeCount || 0}
              {event.maxAttendees && ` / ${event.maxAttendees}`} attendees
            </span>
          </div>

          {event.isPaid && (
            <div className="flex items-center gap-2 font-semibold text-success">
              <FaDollarSign />
              <span>${event.eventFee?.toFixed(2)}</span>
            </div>
          )}
        </div>

        <p className="text-sm text-base-content/60 line-clamp-3">
          {event.description}
        </p>

        <div className="card-actions mt-4">
          <Link
            to={`/events/${event._id}`}
            className={`btn btn-sm w-full ${
              isPast ? "btn-outline" : "btn-primary"
            }`}
          >
            {isPast ? "View Summary" : "View Details"}
          </Link>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default EventCard;
