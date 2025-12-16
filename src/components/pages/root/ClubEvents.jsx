import React from "react";
import { useParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../hooks/axiosInstance";
import Loading from "../../utilities/Loading";
import EventCard from "../../shared/EventCard";
import { FaCalendarTimes } from "react-icons/fa";

const ClubEvents = () => {
  const { id: clubId } = useParams();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["club-events", clubId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/clubs/${clubId}/events`);
      return res.data.sort(
        (a, b) => new Date(a.eventDate) - new Date(b.eventDate)
      );
    },
    enabled: !!clubId,
  });

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6 mt-10">
      <div>
        <h2 className="text-3xl font-bold">Club Events</h2>
        <p className="text-sm text-base-content/60">
          Explore upcoming and recent events hosted by this club
        </p>
      </div>

      {events.length === 0 ? (
        <div className="bg-base-100 rounded-xl p-12 text-center border border-dashed">
          <FaCalendarTimes className="text-5xl text-base-content/50 mx-auto mb-4" />
          <p className="font-semibold text-lg">No Events Available</p>
          <p className="text-sm text-base-content/60">
            This club hasn’t scheduled any events yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            return <EventCard key={event._id} event={event} />;
          })}
        </div>
      )}
    </div>
  );
};

export default ClubEvents;
