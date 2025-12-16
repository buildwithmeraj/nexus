import React from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../hooks/axiosInstance";
import { Link } from "react-router";
import ClubCard from "../../shared/ClubCard";

const fetchClubs = async ({ queryKey }) => {
  const [, limit] = queryKey;
  const res = await axiosInstance.get(`/clubs?limit=${limit}`);
  return res.data;
};

export default function Clubs({ limit = 0 }) {
  const {
    data: clubs = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["clubs", limit],
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
    <div className="">
      {!limit && (
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-6">All Clubs</h2>
          <p className="text-sm mt-1">
            Browse all clubs and find something you're interested in!
          </p>
        </div>
      )}
      {clubs.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No clubs available.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {clubs.map((club) => (
          <ClubCard club={club} />
        ))}
      </div>
      {limit && (
        <div className="flex items-center justify-center mt-4">
          <Link to="/clubs" className="btn btn-primary">
            All Clubs
          </Link>
        </div>
      )}
    </div>
  );
}
