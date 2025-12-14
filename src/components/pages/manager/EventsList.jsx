import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import useAxiosSecureInstance from "../../../hooks/useSecureAxiosInstance";
import { useAuth } from "../../../contexts/AuthContext";
import Loading from "../../utilities/Loading";
import { Link } from "react-router";
import {
  FaEdit,
  FaTrash,
  FaCalendar,
  FaMapMarkerAlt,
  FaDollarSign,
  FaUsers,
} from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import toast from "react-hot-toast";
import UpdateEventModal from "./UpdateEventModal";
import DeleteEventModal from "./DeleteEventModal";

const EventsList = () => {
  const queryClient = useQueryClient();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { user } = useAuth();
  const managerEmail = user?.email;

  const axiosSecure = useAxiosSecureInstance();

  // Fetch all clubs managed by the user
  const { data: clubsList = [] } = useQuery({
    queryKey: ["manager-clubs"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/clubs/${managerEmail}`);
      return res.data;
    },
  });

  // Fetch all events for all clubs managed by the user
  const {
    data: eventsList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["manager-events", clubsList],
    queryFn: async () => {
      if (clubsList.length === 0) return [];

      try {
        // Fetch events for each club
        const eventPromises = clubsList.map((club) =>
          axiosSecure
            .get(`/clubs/${club._id}/events`)
            .then((res) =>
              res.data.map((event) => ({ ...event, clubData: club }))
            )
            .catch(() => [])
        );

        const allEvents = await Promise.all(eventPromises);
        return allEvents
          .flat()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } catch (error) {
        console.error("Error fetching events:", error);
        return [];
      }
    },
    enabled: clubsList.length > 0,
  });

  const deleteEvent = async (eventId) => {
    try {
      await axiosSecure.delete(`/events/${eventId}`);
      toast.success("Event deleted successfully");
      refetch();
      queryClient.invalidateQueries(["manager-events"]);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(error.response?.data?.message || "Failed to delete event");
    }
  };

  const handleEditClick = (event) => {
    setSelectedEvent(event);
    setShowUpdateModal(true);
  };

  const handleDeleteClick = (event) => {
    setSelectedEvent(event);
    setShowDeleteModal(true);
  };

  const handleUpdateSuccess = () => {
    refetch();
    queryClient.invalidateQueries(["manager-events"]);
    setShowUpdateModal(false);
    toast.success("Event updated successfully");
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

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center flex-col md:flex-row justify-between">
        <div>
          <h2 className="text-2xl font-bold">Events Management</h2>
          <p className="text-gray-600 text-sm">
            Manage all events across your clubs ({eventsList.length} total)
          </p>
        </div>
        <Link
          className="btn btn-success btn-sm gap-2 mt-4 md:mt-0"
          to="/dashboard/manager/add-event"
        >
          <IoMdAdd size={18} />
          Create Event
        </Link>
      </div>

      {/* Events List */}
      {eventsList.length < 1 ? (
        <div className="bg-base-100 rounded-lg p-12 text-center border-2 border-dashed border-base-300">
          <FaCalendar className="text-4xl text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 font-semibold">No Events Found</p>
          <p className="text-gray-400 text-sm mb-4">
            Create your first event to get started
          </p>
          <Link
            className="btn btn-primary btn-sm gap-2"
            to="/dashboard/manager/add-event"
          >
            <IoMdAdd size={16} />
            Create Event
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* List View for Desktop */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Event Title</th>
                  <th>Club</th>
                  <th>Date & Time</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Attendees</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {eventsList.map((event) => (
                  <tr key={event._id} className="hover:bg-base-200">
                    <td className="font-semibold">{event.title}</td>
                    <td>
                      <span className="badge badge-outline">
                        {event.clubData?.clubName || "Unknown Club"}
                      </span>
                    </td>
                    <td className="text-sm">
                      <div className="flex items-center gap-2">
                        <FaCalendar size={14} className="text-primary" />
                        {formatDate(event.eventDate)}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt size={14} className="text-error" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          event.isPaid ? "badge-warning" : "badge-success"
                        }`}
                      >
                        {event.isPaid ? "Paid" : "Free"}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <FaUsers size={14} />
                        <span className="text-sm">
                          {event.attendeeCount || 0}
                          {event.maxAttendees && `/${event.maxAttendees}`}
                        </span>
                      </div>
                    </td>
                    <td className="flex items-center gap-2">
                      <button
                        className="btn btn-sm btn-ghost gap-1"
                        onClick={() => handleEditClick(event)}
                        title="Edit event"
                      >
                        <FaEdit size={14} />
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-ghost text-error gap-1"
                        onClick={() => handleDeleteClick(event)}
                        title="Delete event"
                      >
                        <FaTrash size={14} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Card View for Mobile */}
          <div className="lg:hidden grid grid-cols-1 gap-4">
            {eventsList.map((event) => (
              <div
                key={event._id}
                className="bg-base-100 rounded-lg p-4 border border-base-300 shadow-sm"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{event.title}</h3>
                    <span className="badge badge-outline badge-sm">
                      {event.clubData?.clubName || "Unknown Club"}
                    </span>
                  </div>
                  <span
                    className={`badge badge-sm ${
                      event.isPaid ? "badge-warning" : "badge-success"
                    }`}
                  >
                    {event.isPaid ? "Paid" : "Free"}
                  </span>
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <FaCalendar
                      size={14}
                      className="text-primary flex-shrink-0"
                    />
                    <span>{formatDate(event.eventDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt
                      size={14}
                      className="text-error flex-shrink-0"
                    />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaUsers size={14} className="text-info flex-shrink-0" />
                    <span>
                      {event.attendeeCount || 0}
                      {event.maxAttendees && `/${event.maxAttendees}`} attendees
                    </span>
                  </div>
                  {event.isPaid && (
                    <div className="flex items-center gap-2">
                      <FaDollarSign
                        size={14}
                        className="text-success flex-shrink-0"
                      />
                      <span>${event.eventFee.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {event.description}
                </p>

                <div className="flex gap-2">
                  <button
                    className="btn btn-sm btn-primary flex-1 gap-1"
                    onClick={() => handleEditClick(event)}
                  >
                    <FaEdit size={14} />
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-error flex-1 gap-1"
                    onClick={() => handleDeleteClick(event)}
                  >
                    <FaTrash size={14} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Update Event Modal */}
      {showUpdateModal && (
        <UpdateEventModal
          event={selectedEvent}
          isOpen={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          onSuccess={handleUpdateSuccess}
        />
      )}

      {/* Delete Event Modal */}
      {showDeleteModal && (
        <DeleteEventModal
          event={selectedEvent}
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => deleteEvent(selectedEvent._id)}
        />
      )}
    </div>
  );
};

export default EventsList;
