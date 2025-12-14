import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import useAxiosSecureInstance from "../../../hooks/useSecureAxiosInstance";
import { useAuth } from "../../../contexts/AuthContext";
import Loading from "../../utilities/Loading";
import { Link } from "react-router";
import { FaHourglassHalf } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { MdCancel, MdDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";

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

  const deleteClub = async (clubId) => {
    try {
      await axiosSecure.delete(`/clubs/${clubId}`);
    } catch (e) {
      console.error("Delete failed:", e);
    } finally {
      refetch();
      queryClient.invalidateQueries(["clubs-list"]);
      document.getElementById("delete_club_modal").checked = false;
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div>
      <div className="flex items-center flex-col md:flex-row justify-between">
        <h2>Your Clubs {clubList.length}</h2>
        <Link
          className="btn btn-success btn-sm"
          to="/dashboard/club-manager/add-club"
        >
          <IoMdAdd />
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
                <tr key={club._id} className="hover:bg-base-300">
                  <td className="font-bold">{club.clubName}</td>
                  <td>{club.category}</td>
                  <td>{club.location}</td>
                  <td>{club.membershipFee}</td>
                  <td>{club.status}</td>
                  <td>{club.createdAt}</td>
                  <td className="flex items-center gap-2">
                    {club.status === "pending" && (
                      <button className="btn btn-xs" disabled>
                        <FaHourglassHalf />
                        Pending
                      </button>
                    )}
                    {club.status === "approved" && (
                      <Link
                        className="btn btn-xs btn-primary"
                        to={`/dashboard/club-manager/clubs/${club._id}`}
                      >
                        <FaGear />
                        Manage
                      </Link>
                    )}
                    {club.status === "rejected" && (
                      <button className="btn btn-xs" disabled>
                        <MdCancel />
                        Rejected
                      </button>
                    )}
                    <label
                      htmlFor="delete_club_modal"
                      className="btn btn-xs btn-error"
                      onClick={() =>
                        setSelectedClub({
                          id: club._id,
                          name: club.clubName,
                        })
                      }
                    >
                      <MdDelete />
                      Delete
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* DELETE MODAL */}
      <input type="checkbox" id="delete_club_modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-red-600">Delete Club</h3>

          <p className="py-4">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{selectedClub?.name}</span>? This
            action is permanent.
          </p>

          <div className="modal-action">
            <label
              className="btn btn-error"
              onClick={() => deleteClub(selectedClub?.id)}
            >
              Confirm Delete
            </label>

            <label htmlFor="delete_club_modal" className="btn">
              Cancel
            </label>
          </div>
        </div>

        <label htmlFor="delete_club_modal" className="modal-backdrop" />
      </div>
    </div>
  );
};

export default ClubsList;
