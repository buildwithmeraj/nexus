import React, { useState, useRef } from "react";
import { useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecureInstance from "../../../hooks/useSecureAxiosInstance";
import toast from "react-hot-toast";
import Loading from "../../utilities/Loading";
import EventForm from "./EventForm";

export default function ClubEvents() {
  const { id: clubId } = useParams();
  const axiosSecure = useAxiosSecureInstance();
  const queryClient = useQueryClient();
  const [editingEvent, setEditingEvent] = useState(null);
  const modalRef = useRef(null);

  // Fetch events
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["clubEvents", clubId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/clubs/${clubId}/events`);
      return res.data;
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (eventId) => {
      return await axiosSecure.delete(`/events/${eventId}`);
    },
    onSuccess: () => {
      toast.success("Event deleted successfully");
      queryClient.invalidateQueries(["clubEvents", clubId]);
    },
    onError: () => toast.error("Failed to delete event"),
  });

  const handleAddEvent = () => {
    setEditingEvent(null);
    setTimeout(() => {
      modalRef.current?.showModal();
    }, 0);
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setTimeout(() => {
      modalRef.current?.showModal();
    }, 0);
  };

  const handleCloseForm = () => {
    setEditingEvent(null);
    modalRef.current?.close();
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries(["clubEvents", clubId]);
    handleCloseForm();
  };

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Club Events</h2>
        <button className="btn btn-primary" onClick={handleAddEvent}>
          + Add Event
        </button>
      </div>

      {/* Event Form Modal */}
      <EventForm
        ref={modalRef}
        clubId={clubId}
        event={editingEvent}
        onClose={handleCloseForm}
        onSuccess={handleSuccess}
      />

      {/* Events List */}
      {events.length === 0 ? (
        <div className="text-center py-12 bg-base-200 rounded-lg">
          <p className="text-gray-600 text-lg">No events created yet</p>
          <button className="btn btn-primary mt-4" onClick={handleAddEvent}>
            Create First Event
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event._id}
              className="card bg-base-100 shadow-lg hover:shadow-xl transition"
            >
              <div className="card-body">
                <h3 className="card-title text-lg">{event.title}</h3>

                <p className="text-sm text-gray-600">
                  {event.description.substring(0, 100)}...
                </p>

                <div className="space-y-2 text-sm my-2">
                  <p>
                    <strong>📅 Date:</strong>{" "}
                    {new Date(event.eventDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>📍 Location:</strong> {event.location}
                  </p>
                  <p>
                    <strong>👥 Attendees:</strong> {event.attendeeCount}
                    {event.maxAttendees ? `/${event.maxAttendees}` : ""}
                  </p>

                  {event.isPaid && (
                    <p className="text-green-600 font-semibold">
                      💰 Fee: ${event.eventFee}
                    </p>
                  )}
                </div>

                <div className="card-actions justify-end gap-2 mt-4">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleEdit(event)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => deleteMutation.mutate(event._id)}
                    disabled={deleteMutation.isLoading}
                  >
                    {deleteMutation.isLoading ? "..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
