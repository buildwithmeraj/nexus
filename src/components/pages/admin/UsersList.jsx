import React, { useState } from "react";
import useAxiosSecureInstance from "../../../hooks/useSecureAxiosInstance";
import Loading from "../../utilities/Loading";
import { useAuth } from "../../../contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ClubManagerApplications from "./ClubManagerApplications";
import { FaSearch } from "react-icons/fa";

const UsersList = () => {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState(null);
  const axiosSecure = useAxiosSecureInstance();
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data: usersList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/users");
      return res.data;
    },
  });
  const { user } = useAuth();
  const adminEmail = user?.email;

  // Utility function
  const capitalizeWords = (str) => {
    if (str === "clubManager") {
      str = "club manager";
    }
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const updateUserRole = async (userId, type) => {
    //console.log(userId, type);
    try {
      await axiosSecure.patch(`/users/role/${userId}`, {
        type: type,
      });
    } catch (error) {
      console.error("Failed to update user role:", error);
      // Here you could show an error message to the user
    } finally {
      refetch();
      queryClient.invalidateQueries(["club-manager-applications"]);
    }
  };
  const matchesSearch = (user) => {
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.role?.toLowerCase().includes(term)
    );
  };

  if (isLoading) return <Loading />;

  // Role color classes
  const roleClassMap = {
    admin: "text-green-600",
    clubManager: "text-amber-600",
    member: "text-blue-600",
  };

  // Generate action buttons
  const renderActionButtons = (user) => {
    if (user.role === "admin")
      return (
        <div className="flex gap-2 items-center">
          <div className="tooltip" data-tip="You can not change admin role">
            <button className="btn btn-xs btn-warning " disabled>
              Promote
            </button>
          </div>
          <div className="tooltip" data-tip="You can not change admin role">
            <button className="btn btn-xs btn-warning " disabled>
              Demote
            </button>
          </div>
        </div>
      );
    if (user.role === "clubManager") {
      return (
        <div className="flex gap-2 items-center">
          <label
            htmlFor="promote_modal"
            className="btn btn-xs btn-success mr-2"
            onClick={() =>
              setSelectedUser({
                id: user._id,
                name: user.name,
                role: "Admin",
              })
            }
          >
            Promote
          </label>

          <label
            htmlFor="demote_modal"
            className="btn btn-xs btn-warning"
            onClick={() =>
              setSelectedUser({
                id: user._id,
                name: user.name,
                role: "Member",
              })
            }
          >
            Demote
          </label>
        </div>
      );
    }

    return (
      <div className="flex gap-2 items-center">
        <label
          htmlFor="promote_modal"
          className="btn btn-xs btn-success"
          onClick={() =>
            setSelectedUser({
              id: user._id,
              name: user.name,
              role: "Club Manager",
            })
          }
        >
          Promote
        </label>
        <div className="tooltip" data-tip="You can not demote member role">
          <button className="btn btn-xs btn-warning " disabled>
            Demote
          </button>
        </div>
      </div>
    );
  };

  // Add this helper function:
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-2 flex-col lg:flex-row">
        <h2>User List ({usersList.length - 1})</h2>
        <div className="flex items-center gap-2 justify-between lg:pr-[9%]">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 z-10" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered input-sm max-w-6xl pl-10"
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

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {usersList
              .filter((u) => u.email !== adminEmail)
              .filter(matchesSearch)
              .map((user) => (
                <tr key={user._id} className="hover:bg-base-300">
                  <td>
                    <div className="font-bold">{user.name}</div>
                  </td>

                  <td>{user.email}</td>

                  <td className={`font-semibold ${roleClassMap[user.role]}`}>
                    {capitalizeWords(user.role)}
                  </td>

                  <td>{formatDate(user.createdAt)}</td>

                  <td>{renderActionButtons(user)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <ClubManagerApplications />

      <input type="checkbox" id="promote_modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Promotion</h3>

          <p className="py-4">
            Are you sure you want to promote{" "}
            <span className="font-semibold">{selectedUser?.name}</span> to{" "}
            <span className="font-semibold">{selectedUser?.role}</span>?
          </p>

          <div className="modal-action">
            <label
              className="btn btn-success"
              onClick={async () => {
                await updateUserRole(selectedUser?.id, "promote");
                document.getElementById("promote_modal").checked = false;
              }}
            >
              Confirm
            </label>
            <label htmlFor="promote_modal" className="btn">
              Close
            </label>
          </div>
        </div>

        <label htmlFor="promote_modal" className="modal-backdrop" />
      </div>

      <input type="checkbox" id="demote_modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Demotion</h3>

          <p className="py-4">
            Are you sure you want to demote{" "}
            <span className="font-semibold">{selectedUser?.name}</span> to{" "}
            <span className="font-semibold">{selectedUser?.role}</span>?
          </p>

          <div className="modal-action">
            <label
              className="btn btn-success"
              onClick={async () => {
                updateUserRole(selectedUser?.id, "demote");
                document.getElementById("demote_modal").checked = false;
              }}
            >
              Confirm
            </label>
            <label htmlFor="demote_modal" className="btn">
              Close
            </label>
          </div>
        </div>

        <label htmlFor="demote_modal" className="modal-backdrop" />
      </div>
    </div>
  );
};

export default UsersList;
