import React from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../hooks/axiosInstance";
import { Link } from "react-router";

const fetchClubs = async () => {
  const res = await axiosInstance.get("/clubs");
  return res.data;
};

export default function Clubs() {
  const {
    data: clubs,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["clubs"],
    queryFn: fetchClubs,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20">
        <h2 className="text-red-500 text-lg font-semibold">
          Failed to load clubs
        </h2>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">All Clubs</h1>

      {(!clubs || clubs.length === 0) && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No clubs available.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubs.map((club) => (
          <div key={club._id} className="card bg-base-100 shadow-xl">
            <figure>
              <img
                src={club.bannerImage}
                alt={club.clubName}
                className="h-52 w-full object-cover"
              />
            </figure>

            <div className="card-body">
              <h2 className="card-title">{club.clubName}</h2>

              <p className="text-sm text-gray-600">{club.description}</p>

              <div className="mt-3 space-y-1 text-sm">
                <p>
                  <span className="font-semibold">Category:</span>{" "}
                  {club.category}
                </p>
                <p>
                  <span className="font-semibold">Location:</span>{" "}
                  {club.location}
                </p>
                <p>
                  <span className="font-semibold">Membership Fee:</span>{" "}
                  {club.membershipFee ? `$${club.membershipFee}` : "Free"}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  <span
                    className={`badge ${
                      club.status === "approved"
                        ? "badge-success"
                        : club.status === "rejected"
                        ? "badge-error"
                        : "badge-warning"
                    }`}
                  >
                    {club.status}
                  </span>
                </p>
              </div>

              <div className="card-actions mt-4">
                <Link
                  className="btn btn-primary w-full"
                  to={`/clubs/${club._id}`}
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
