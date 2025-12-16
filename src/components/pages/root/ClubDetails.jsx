import React from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../hooks/axiosInstance";
import ClubMembershipStatus from "../auth/ClubMembershipStatus";
import Loading from "../../utilities/Loading";
import WarningMsg from "../../utilities/Warning";
import {
  FaMapMarkerAlt,
  FaTag,
  FaUsers,
  FaCreditCard,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";
import ClubEvents from "./ClubEvents";

const fetchClubDetails = async ({ queryKey }) => {
  const [, clubId] = queryKey;
  const res = await axiosInstance.get(`/clubs/details/${clubId}`);
  return res.data;
};

export default function ClubDetails() {
  const { id } = useParams();

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

  if (isLoading) return <Loading />;

  if (isError) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <FaTimesCircle className="text-6xl text-error mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-error mb-2">
              Unauthorized Access
            </h2>
            <p className="text-base-content/70">
              You do not have permission to view this club.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <FaTimesCircle className="text-6xl text-error mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-error mb-2">
            Failed to load club
          </h2>
          <p className="text-base-content/70">{error.message}</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    if (status === "approved") return "badge-success";
    if (status === "rejected") return "badge-error";
    return "badge-warning";
  };

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <div className="mb-4">
          <h2 className="">{club.clubName}</h2>
        </div>

        <div className="relative h-48 md:h-80 lg:h-96 overflow-hidden">
          <img
            src={club.bannerImage}
            alt={club.clubName}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/1200x400?text=" +
                encodeURIComponent(club.clubName);
            }}
          />
          {(club.status === "pending" || club.status === "rejected") && (
            <div className="absolute top-2 right-2">
              <div
                className={`badge badge-lg ${getStatusColor(
                  club.status
                )} shadow-lg`}
              >
                <span className="capitalize">{club.status}</span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-base-100 rounded-lg p-4 shadow-sm border border-base-200">
            <div className="flex items-center gap-3 mb-2">
              <FaTag className="text-primary text-xl" />
              <span className="text-sm text-base-content/70 font-medium">
                Category
              </span>
            </div>
            <p className="text-lg font-semibold">{club.category}</p>
          </div>

          <div className="bg-base-100 rounded-lg p-4 shadow-sm border border-base-200">
            <div className="flex items-center gap-3 mb-2">
              <FaMapMarkerAlt className="text-error text-xl" />
              <span className="text-sm text-base-content/70 font-medium">
                Location
              </span>
            </div>
            <p className="text-lg font-semibold">{club.location}</p>
          </div>

          <div className="bg-base-100 rounded-lg p-4 shadow-sm border border-base-200">
            <div className="flex items-center gap-3 mb-2">
              <FaCreditCard className="text-success text-xl" />
              <span className="text-sm text-base-content/70 font-medium">
                Joining Fee
              </span>
            </div>
            <p className="text-lg font-semibold">
              {club.membershipFee && club.membershipFee > 0
                ? `$${club.membershipFee}`
                : "Free"}
            </p>
          </div>

          <div className="bg-base-100 rounded-lg p-4 shadow-sm border border-base-200">
            <div className="flex items-center gap-3 mb-2">
              <FaUsers className="text-info text-xl" />
              <span className="text-sm text-base-content/70 font-medium">
                Club Manager Email
              </span>
            </div>
            <p
              className="text-lg font-semibold truncate"
              aria-details={club.managerEmail}
            >
              {club.managerEmail}
            </p>
          </div>
        </div>

        <p className="text-lg leading-relaxed">{club.description}</p>

        <div className="mb-8">
          {club.status === "approved" ? (
            <ClubMembershipStatus
              clubId={club._id}
              clubFee={club.membershipFee}
            />
          ) : (
            <WarningMsg message="This club is not currently available for membership. Please check back later!" />
          )}
        </div>

        <ClubEvents clubId={club._id} />
      </div>
    </>
  );
}
