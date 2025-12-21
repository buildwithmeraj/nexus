import React, { useState } from "react";
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
  FaSearch,
  FaCalendarAlt,
} from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

const AllEvents = ({ limit = 0 }) => {
  const axiosSecure = useAxiosSecureInstance();

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClub, setSelectedClub] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [isPaid, setIsPaid] = useState("");
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [sort, setSort] = useState("newest");

  // Fetch all clubs for filter dropdown
  const { data: clubsList = { data: [] } } = useQuery({
    queryKey: ["clubs-list"],
    queryFn: async () => {
      const res = await axiosSecure.get("/clubs");
      return res.data;
    },
  });

  const clubs = clubsList.data || [];

  // Fetch all events with filters
  const {
    data: eventsResponse = { data: [] },
    isLoading: eventsLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "all-events",
      limit,
      searchQuery,
      selectedClub,
      selectedLocation,
      isPaid,
      minDate,
      maxDate,
      sort,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (limit > 0) params.append("limit", limit);
      if (limit > 0) params.append("sort", "upcoming");
      if (searchQuery) params.append("search", searchQuery);
      if (selectedClub) params.append("clubId", selectedClub);
      if (selectedLocation) params.append("location", selectedLocation);
      if (isPaid) params.append("isPaid", isPaid);
      if (minDate) params.append("minDate", minDate);
      if (maxDate) params.append("maxDate", maxDate);
      if (sort) params.append("sort", sort);

      const res = await axiosSecure.get(`/events?${params.toString()}`);
      return res.data;
    },
  });

  const events = Array.isArray(eventsResponse)
    ? eventsResponse
    : eventsResponse.data || [];

  // Get unique locations from events
  const uniqueLocations = React.useMemo(() => {
    const locations = new Set(events.map((e) => e.location).filter(Boolean));
    return Array.from(locations).sort();
  }, [events]);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const hasActiveFilters =
    searchQuery ||
    selectedClub ||
    selectedLocation ||
    isPaid ||
    minDate ||
    maxDate ||
    sort !== "newest";

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedClub("");
    setSelectedLocation("");
    setIsPaid("");
    setMinDate("");
    setMaxDate("");
    setSort("newest");
  };

  if (eventsLoading) return <Loading />;

  if (isError) {
    return (
      <div className="text-center py-20">
        <h2 className="text-error font-semibold">Failed to load events</h2>
        <p>{error?.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!limit && (
        <div>
          <h2 className="text-3xl font-bold mb-2">All Events</h2>
          <p className="text-sm text-base-content/70">
            Browse events across all clubs and find something you love!
          </p>
        </div>
      )}

      {!limit && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/40 z-10" />
              <input
                type="text"
                placeholder="Search events by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-bordered w-full pl-12"
              />
            </div>
            <div className="flex items-center">
              <select
                value={selectedClub}
                onChange={(e) => setSelectedClub(e.target.value)}
                className="select select-bordered w-full text-sm"
              >
                <option value="">All Clubs</option>
                {clubs.map((club) => (
                  <option key={club._id} value={club._id}>
                    {club.clubName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="select select-bordered w-full text-sm"
              >
                <option value="">All Locations</option>
                {uniqueLocations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <select
                value={isPaid}
                onChange={(e) => setIsPaid(e.target.value)}
                className="select select-bordered w-full text-sm"
              >
                <option value="">All Types</option>
                <option value="false">Free</option>
                <option value="true">Paid</option>
              </select>
            </div>

            <div className="flex items-center">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="select select-bordered w-full text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="upcoming">Upcoming First</option>
                <option value="highest-fee">Highest Fee</option>
                <option value="lowest-fee">Lowest Fee</option>
              </select>
            </div>
            <button
              onClick={resetFilters}
              className="btn btn-outline gap-2"
              disabled={!hasActiveFilters}
            >
              <IoMdClose size={16} />
              Clear All
            </button>
          </div>
        </>
      )}

      {events.length === 0 ? (
        <div className="bg-base-100 rounded-lg text-center border-2 border-dashed border-base-300 flex items-center justify-center flex-col py-30 text-base-content/50">
          <FaExclamationTriangle className="text-4xl text-warning mx-auto mb-4" />
          <p className="font-semibold mb-2">No Events Found</p>
          <p className="text-sm text-base-content/70">
            {hasActiveFilters
              ? "Try adjusting your filters"
              : "Check back later for events."}
          </p>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="btn btn-outline btn-sm mt-4"
            >
              <IoMdClose size={16} />
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {events.map((event) => {
            const clubName =
              clubs.find((c) => c._id === event.clubId)?.clubName ||
              event.clubName ||
              "Unknown Club";
            return (
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
                  title={`View ${clubName} club`}
                >
                  <FaUsers size={20} />
                  {clubName}
                </Link>

                <div className="space-y-1 text-sm text-base-content/70 mb-4">
                  <div className="flex items-center gap-2">
                    <FaCalendar className="text-primary" />
                    {formatDate(event.eventDate)}
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-error" /> {event.location}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <FaUsers className="text-info" />
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

                <p className="text-base-content/70 text-sm mb-4 line-clamp-3">
                  {event.description}
                </p>

                <Link
                  to={`/events/${event._id}`}
                  className="btn btn-primary w-full mt-auto"
                >
                  View Event
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {limit > 0 && events.length > 0 && (
        <div className="flex justify-center items-center mt-6">
          <Link to="/events" className="btn btn-primary">
            <FaCalendarAlt size={14} />
            View All Events
          </Link>
        </div>
      )}
    </div>
  );
};

export default AllEvents;
