import React from "react";
import { useLocation } from "react-router";
import ClubsList from "../manager/ClubsList";
import EventsList from "../manager/EventsList";

const ClubManager = () => {
  const { pathname } = useLocation();

  const isRoot = pathname === "/dashboard/club-manager";
  const isClubs = pathname.includes("/clubs");
  const isEvents = pathname.includes("/events");
  const isAdd = pathname.includes("/add");

  return (
    <div className="space-y-6">
      {/* ROOT DASHBOARD */}
      {isRoot && (
        <>
          <h1 className="text-3xl font-bold">Club Manager Dashboard</h1>
          <p className="text-gray-600">
            Manage your clubs and events from here
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-base-100 p-6 rounded-lg shadow">
              Clubs overview
            </div>
            <div className="bg-base-100 p-6 rounded-lg shadow">
              Events overview
            </div>
          </div>
        </>
      )}

      {/* CLUBS */}
      {isClubs && (
        <div>
          <h1 className="text-3xl font-bold mb-4">My Clubs</h1>
          <ClubsList />
        </div>
      )}

      {/* EVENTS */}
      {isEvents && (
        <div>
          <h1 className="text-3xl font-bold mb-4">All Events</h1>
          <EventsList />
        </div>
      )}

      {/* ADD (OPTIONAL) */}
      {isAdd && (
        <div>
          <h1 className="text-3xl font-bold mb-4">Add New</h1>
          {/* Add form goes here */}
        </div>
      )}
    </div>
  );
};

export default ClubManager;
