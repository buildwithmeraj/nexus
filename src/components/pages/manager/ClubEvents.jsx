import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecureInstance from "../../../hooks/useSecureAxiosInstance";
import {
  FaCalendar,
  FaMapMarkerAlt,
  FaUsers,
  FaEdit,
  FaTrash,
  FaDollarSign,
  FaPlus,
} from "react-icons/fa";
import toast from "react-hot-toast";
import UpdateEventModal from "./UpdateEventModal";
import DeleteEventModal from "./DeleteEventModal";
import { useParams } from "react-router";
import AddEventModal from "./AddEventModal";
import LoadingDashboard from "../../utilities/LoadingDashboard";

const ClubEvents = () => {
  const { id: clubId } = useParams();
  const axiosSecure = useAxiosSecureInstance();
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch events for this club
  const {
    data: events = [],
    isLoading: eventsLoading,
    refetch,
  } = useQuery({
    queryKey: ["club-events", clubId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/clubs/${clubId}/events`);
      return res.data.sort(
        (a, b) => new Date(b.eventDate) - new Date(a.eventDate)
      );
    },
    enabled: !!clubId,
  });

  const deleteEvent = async (eventId) => {
    try {
      await axiosSecure.delete(`/events/${eventId}`);
      toast.success("Event deleted successfully");
      refetch();
      queryClient.invalidateQueries(["club-events", clubId]);
      setShowDeleteModal(false);
    } catch (error) {
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

  const handleAddSuccess = () => {
    refetch();
    queryClient.invalidateQueries(["club-events", clubId]);
  };

  const handleUpdateSuccess = () => {
    refetch();
    queryClient.invalidateQueries(["club-events", clubId]);
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

  if (eventsLoading) return <LoadingDashboard />;

  return (
    <div className="space-y-6 mt-6">
      <div className="flex items-center justify-between gap-4">
        <h2>Club Events</h2>
        <button
          className="btn btn-success gap-2"
          onClick={() => setShowAddModal(true)}
        >
          <FaPlus size={16} />
          Create Event
        </button>
      </div>

      {eventsLoading ? (
        <LoadingDashboard />
      ) : events.length === 0 ? (
        <div className="bg-base-100 rounded-lg p-12 text-center border-2 border-dashed border-base-300">
          <FaCalendar className="text-4xl text-base-content/40 mx-auto mb-4" />
          <p className="text-base-content/50 font-semibold">No Events Found</p>
          <p className="text-base-content/40 text-sm mb-4">
            Create your first event for this club
          </p>
          <button
            className="btn btn-primary btn-sm gap-2"
            onClick={() => setShowAddModal(true)}
          >
            <FaPlus size={16} />
            Create Event
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="hidden lg:block overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Event Title</th>
                  <th>Date & Time</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Attendees</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event._id} className="hover:bg-base-200">
                    <td className="font-semibold">{event.title}</td>
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
                      >
                        <FaEdit size={14} />
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-ghost text-error gap-1"
                        onClick={() => handleDeleteClick(event)}
                      >
                        <FaTrash size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="lg:hidden grid grid-cols-1 gap-4">
            {events.map((event) => (
              <div
                key={event._id}
                className="bg-base-100 rounded-lg p-4 border border-base-300 shadow-sm"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{event.title}</h3>
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
                    <FaCalendar size={14} className="text-primary shrink-0" />
                    <span>{formatDate(event.eventDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt size={14} className="text-error shrink-0" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaUsers size={14} className="text-info shrink-0" />
                    <span>
                      {event.attendeeCount || 0}
                      {event.maxAttendees && `/${event.maxAttendees}`} attendees
                    </span>
                  </div>
                  {event.isPaid && (
                    <div className="flex items-center gap-2">
                      <FaDollarSign
                        size={14}
                        className="text-success shrink-0"
                      />
                      <span>${event.eventFee?.toFixed(2)}</span>
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
                    <FaTrash size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showAddModal && (
        <AddEventModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          clubId={clubId}
          onSuccess={handleAddSuccess}
        />
      )}

      {showUpdateModal && (
        <UpdateEventModal
          event={selectedEvent}
          isOpen={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          onSuccess={handleUpdateSuccess}
        />
      )}

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

export default ClubEvents;
