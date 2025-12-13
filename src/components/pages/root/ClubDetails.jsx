import React from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../hooks/axiosInstance";
import { useAuth } from "../../../contexts/AuthContext";
import ClubMembershipStatus from "../auth/ClubMembershipStatus";

const fetchClubDetails = async ({ queryKey }) => {
  const [, clubId] = queryKey;

  const res = await axiosInstance.get(`/clubs/details/${clubId}`);

  return res.data;
};

export default function ClubDetails() {
  const { user } = useAuth();
  const { id } = useParams();
  const userEmail = user?.email;
  const {
    data: club,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["club", id],
    queryFn: fetchClubDetails,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (isError) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      return (
        <div className="text-center py-20">
          <h2 className="text-red-500 text-xl font-semibold">
            Unauthorized Access
          </h2>
          <p className="text-gray-600">
            You do not have permission to view this club.
          </p>
        </div>
      );
    }

    return (
      <div className="text-center py-20">
        <h2 className="text-red-500 text-lg font-semibold">
          Failed to load club
        </h2>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Banner */}
      <div className="w-full h-64 rounded-xl overflow-hidden shadow-lg mb-6">
        <img
          src={club.bannerImage}
          alt={club.clubName}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Info */}
      <h1 className="text-4xl font-bold mb-4">{club.clubName}</h1>

      <div className="space-y-3 text-gray-700">
        <p className="text-lg">{club.description}</p>

        <p>
          <span className="font-semibold">Category:</span> {club.category}
        </p>

        <p>
          <span className="font-semibold">Location:</span> {club.location}
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

        <p>
          <span className="font-semibold">Manager Email:</span>{" "}
          {club.managerEmail}
        </p>
      </div>

      {/* Actions */}
      <ClubMembershipStatus clubId={club._id} />
    </div>
  );
}
