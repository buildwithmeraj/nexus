import React, { useState } from "react";
import useAxiosSecureInstance from "../../../hooks/useSecureAxiosInstance";
import Loading from "../../utilities/Loading";
import { useAuth } from "../../../contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FaSearch } from "react-icons/fa";

const AdminClubsList = () => {
  const axiosSecure = useAxiosSecureInstance();
  const queryClient = useQueryClient();
  const { role } = useAuth();
  const [selectedClub, setSelectedClub] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // FETCH ALL CLUBS
  const {
    data: clubs = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin-clubs"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/admin/clubs`);
      return res.data;
    },
    enabled: role === "admin",
  });

  if (isLoading) return <Loading />;

  // Approve or Reject
  const updateClubStatus = async (id, status) => {
    try {
      await axiosSecure.patch(`/clubs/status/${id}`, { status });
      toast.success(`Club ${status}`);
      refetch();
      queryClient.invalidateQueries(["clubs"]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update club");
    }
  };

  // Delete
  const deleteClub = async (id) => {
    try {
      await axiosSecure.delete(`/clubs/${id}`);
      toast.success("Club deleted successfully");
      refetch();
      queryClient.invalidateQueries(["clubs"]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete club");
    }
  };

  // Status colors
  const statusColors = {
    pending: "text-yellow-600",
    approved: "text-green-600",
    rejected: "text-red-600",
  };

  // Open modal
  const openModal = (club, type) => {
    setSelectedClub(club);
    setModalType(type);
  };

  // Close modal
  const closeModal = () => {
    setSelectedClub(null);
    setModalType(null);
  };

  // Handle modal confirm action
  const handleConfirm = () => {
    if (!selectedClub) return;

    if (modalType === "approve") updateClubStatus(selectedClub.id, "approved");
    else if (modalType === "reject")
      updateClubStatus(selectedClub.id, "rejected");
    else if (modalType === "delete") deleteClub(selectedClub.id);

    closeModal();
  };

  const matchesSearch = (club) => {
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();
    return (
      club.clubName?.toLowerCase().includes(term) ||
      club.category?.toLowerCase().includes(term) ||
      club.location?.toLowerCase().includes(term) ||
      club.status?.toLowerCase().includes(term) ||
      club.managerEmail?.toLowerCase().includes(term)
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-2 flex-col lg:flex-row">
        <h2 className="text-xl font-bold">All Clubs ({clubs.length})</h2>

        <div className="flex items-center gap-2 lg:pr-[7%]">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 z-10" />
            <input
              type="text"
              placeholder="Search clubs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered input-sm pl-10 w-64"
            />
          </div>

          <button
            className="btn btn-soft btn-sm"
            onClick={() => setSearchTerm("")}
            disabled={!searchTerm}
          >
            Clear
          </button>
        </div>
      </div>

      {clubs.length < 2 ? (
        <InfoMSg message="No Clubs found" />
      ) : (
        <>
          <div className="overflow-x-auto backdrop-blur-xl">
            <table className="table">
              <thead>
                <tr>
                  <th>Club</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Manager</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {clubs.filter(matchesSearch).map((club) => {
                  const isPending = club.status === "pending";

                  return (
                    <tr key={club._id} className="hover:bg-base-300">
                      <td className={`font-bold ${statusColors[club.status]}`}>
                        {club.clubName}
                      </td>
                      <td>{club.category}</td>
                      <td>{club.location}</td>
                      <td
                        className={`font-semibold ${statusColors[club.status]}`}
                      >
                        {club.status.charAt(0).toUpperCase() +
                          club.status.slice(1)}
                      </td>
                      <td>{club.managerEmail}</td>
                      <td className="flex gap-2 items-center">
                        <button
                          className={`btn btn-xs btn-success ${
                            !isPending ? "btn-disabled" : ""
                          }`}
                          onClick={() =>
                            isPending &&
                            openModal(
                              { id: club._id, name: club.clubName },
                              "approve"
                            )
                          }
                        >
                          Approve
                        </button>

                        <button
                          className={`btn btn-xs btn-warning ${
                            !isPending ? "btn-disabled" : ""
                          }`}
                          onClick={() =>
                            isPending &&
                            openModal(
                              { id: club._id, name: club.clubName },
                              "reject"
                            )
                          }
                        >
                          Reject
                        </button>

                        <button
                          className="btn btn-xs btn-error"
                          onClick={() =>
                            openModal(
                              { id: club._id, name: club.clubName },
                              "delete"
                            )
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {modalType && selectedClub && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              {modalType === "approve" && "Approve Club"}
              {modalType === "reject" && "Reject Club"}
              {modalType === "delete" && "Delete Club"}
            </h3>
            <p className="py-4">
              {modalType === "approve" && "Approve "}
              {modalType === "reject" && "Reject "}
              {modalType === "delete" && "Delete "}
              <span className="font-semibold">{selectedClub.name}</span>?
            </p>
            <div className="modal-action">
              <button
                className={`btn ${
                  modalType === "approve"
                    ? "btn-success"
                    : modalType === "reject"
                    ? "btn-warning"
                    : "btn-error"
                }`}
                onClick={handleConfirm}
              >
                Confirm
              </button>
              <button className="btn" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClubsList;
