import React from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../hooks/axiosInstance";
import Loading from "../../utilities/Loading";
import { Link } from "react-router";

export default function ClubEventsView() {
  const { id: clubId } = useParams();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["clubEvents", clubId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/clubs/${clubId}/events`);
      return res.data;
    },
  });

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Upcoming Events</h2>

      {events.length === 0 ? (
        <div className="text-center py-12 bg-base-200 rounded-lg">
          <p className=" text-lg">No upcoming events</p>
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
                <p className="text-sm ">{event.description}</p>

                <div className="space-y-2 text-sm my-2">
                  <p>
                    <strong>📅 Date:</strong>{" "}
                    {new Date(event.eventDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>📍 Location:</strong> {event.location}
                  </p>
                  <p>
                    <strong>👥 Attending:</strong> {event.attendeeCount}
                    {event.maxAttendees ? `/${event.maxAttendees}` : ""}
                  </p>

                  {event.isPaid && (
                    <p className="text-green-600 font-semibold">
                      💰 Fee: ${event.eventFee}
                    </p>
                  )}
                </div>

                <Link
                  to={`/events/${event._id}`}
                  className="btn btn-primary btn-sm w-full"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
