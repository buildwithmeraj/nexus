import React from "react";
import { Link } from "react-router";
import { format } from "../../../node_modules/date-fns/format";

const ClubCard = ({ club }) => {
  return (
    <div key={club._id} className="card bg-base-100 shadow-xl rounded-xl">
      <figure className="relative">
        <img
          src={club.bannerImage}
          alt={club.clubName}
          className="h-40 w-full object-contain"
        />
        {(club.status === "pending" || club.status === "rejected") && (
          <span
            className={`absolute top-2 right-2 badge ${
              club.status === "approved"
                ? "badge-success"
                : club.status === "rejected"
                ? "badge-error"
                : "badge-warning"
            }`}
          >
            {club.status}
          </span>
        )}
      </figure>

      <div className="card-body">
        <h2 className="card-title">{club.clubName}</h2>
        <p className="text-sm text-base-content/80">{club.description}</p>

        <div className="mt-3 space-y-1 text-sm">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold">Category:</span> {club.category}
            </div>
            <div>
              <span className="font-semibold">Location:</span> {club.location}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold">Fee:</span>{" "}
              {club.membershipFee ? `$${club.membershipFee}` : "Free"}
            </div>
            <div>
              <span className="font-semibold">Since:</span>{" "}
              {format(club.createdAt, "dd MMM yyyy")}
            </div>
          </div>
        </div>

        <div className="card-actions mt-2">
          <Link className="btn btn-primary w-full" to={`/clubs/${club._id}`}>
            View Club
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClubCard;
