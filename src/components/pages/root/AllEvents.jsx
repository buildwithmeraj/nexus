import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecureInstance from "../../../hooks/useSecureAxiosInstance";
import Loading from "../../utilities/Loading";
import { Link } from "react-router";
import {
  FaCalendar,
  FaMapMarkerAlt,
  FaDollarSign,
  FaUsers,
  FaExclamationTriangle,
} from "react-icons/fa";
import { RiUserCommunityFill } from "react-icons/ri";
import { FaHandsHoldingCircle } from "react-icons/fa6";

const AllEvents = ({ limit = 0 }) => {
  const axiosSecure = useAxiosSecureInstance();

  // Fetch all events
  const { data: eventsList = [], isLoading: eventsLoading } = useQuery({
    queryKey: ["all-events", limit],
    queryFn: async () => {
      const res = await axiosSecure.get("/events");
      return res.data;
    },
  });

  // Fetch all clubs
  const { data: clubsList = [] } = useQuery({
    queryKey: ["clubs-list"],
    queryFn: async () => {
      const res = await axiosSecure.get("/clubs");
      return res.data;
    },
  });

  // Map club IDs to names
  const clubNameMap = React.useMemo(() => {
    const map = {};
    clubsList.forEach((club) => {
      map[club._id] = club.clubName;
    });
    return map;
  }, [clubsList]);

  // Enrich events with club names
  const enrichedEventsList = React.useMemo(() => {
    return eventsList.map((event) => ({
      ...event,
      clubName: clubNameMap[event.clubId] || event.clubName || "Unknown Club",
    }));
  }, [eventsList, clubNameMap]);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (eventsLoading) return <Loading />;

  return (
    <div className="space-y-6">
      {!limit && (
        <div>
          <h2 className="text-3xl font-bold mb-2">Upcoming Events</h2>
          <p className="text-sm text-gray-500">
            Browse events across all clubs and find something you love!
          </p>
        </div>
      )}

      {enrichedEventsList.length === 0 ? (
        <div className="bg-base-100 rounded-lg p-12 text-center border-2 border-dashed border-base-300">
          <FaExclamationTriangle className="text-4xl text-warning mx-auto mb-4" />
          <p className="font-semibold mb-2">No Upcoming Events</p>
          <p className="text-sm text-gray-500">Check back later for events.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {enrichedEventsList
            .slice(0, limit || enrichedEventsList.length)
            .map((event) => (
              <div
                key={event._id}
                className="bg-base-100 rounded-xl shadow-lg p-5 flex flex-col justify-between hover:shadow-xl transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg line-clamp-2">
                    {event.title}
                  </h3>
                  <span
                    className={`badge badge-sm ${
                      event.isPaid ? "badge-warning" : "badge-success"
                    }`}
                  >
                    {event.isPaid ? "Paid" : "Free"}
                  </span>
                </div>

                <Link
                  to={`/clubs/${event.clubId}`}
                  className="mb-3 link-primary flex items-center gap-1.5 font-medium"
                  title={`View ${event.clubName} club`}
                >
                  <FaHandsHoldingCircle size={20} />
                  {event.clubName}
                </Link>

                <div className="space-y-1 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <FaCalendar className="text-primary" />{" "}
                    {formatDate(event.eventDate)}
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-error" /> {event.location}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <FaUsers className="text-info" />{" "}
                      {event.attendeeCount || 0}
                      {event.maxAttendees && `/${event.maxAttendees}`} attendees
                    </div>
                    {event.isPaid && (
                      <div className="flex items-center gap-1">
                        <FaDollarSign className="text-success" />
                        {event.eventFee?.toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                  {event.description}
                </p>

                <Link
                  to={`/events/${event._id}`}
                  className="btn btn-primary w-full mt-auto"
                >
                  View Event
                </Link>
              </div>
            ))}
        </div>
      )}

      {limit > 0 && (
        <div className="flex justify-center mt-4">
          <Link to="/events" className="btn btn-primary">
            View All Events
          </Link>
        </div>
      )}
    </div>
  );
};

export default AllEvents;
