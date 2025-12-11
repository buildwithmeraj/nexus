import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import useAxiosSecureInstance from "../../../hooks/useSecureAxiosInstance";
import { useAuth } from "../../../contexts/AuthContext";
import Loading from "../../utilities/Loading";
import { Link } from "react-router";

const ClubsList = () => {
  const queryClient = useQueryClient();
  const [selectedClub, setSelectedClub] = useState(null);
  const { user } = useAuth();
  const clubManagerEmail = user?.email;
  const axiosSecure = useAxiosSecureInstance();
  const {
    data: clubList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["clubs-list"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/clubs/${clubManagerEmail}`);
      return res.data;
    },
  });
  if (isLoading) return <Loading />;
  return (
    <div>
      <div className="flex items-center flex-col md:flex-row justify-between">
        <h2>Your Clubs {clubList.length}</h2>
        <Link className="btn" to="/dashboard/club-manager/add-club">
          Add
        </Link>
      </div>
      {clubList.length < 1 ? (
        "No Clubs Found"
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Location</th>
                <th>Membership Fee</th>
                <th>Status</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {clubList.map((club) => (
                <tr key={club._id}>
                  <td className="font-bold">{club.clubName}</td>
                  <td>{club.category}</td>
                  <td>{club.location}</td>
                  <td>{club.membershipFee}</td>
                  <td>{club.status}</td>
                  <td>{club.createdAt}</td>
                  <td>Delete</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClubsList;
