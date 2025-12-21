import React, { useState } from "react";
import useAxiosSecureInstance from "../../../hooks/useSecureAxiosInstance";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "../../utilities/Loading";
import { FaSearch } from "react-icons/fa";

const ClubManagerApplications = () => {
  const queryClient = useQueryClient();
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const axiosSecure = useAxiosSecureInstance();

  const {
    data: clubManagerApplicationsList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["club-manager-applications"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/club-manager-applications");
      return res.data;
    },
  });

  const capitalizeWords = (str) => {
    if (!str) return "";
    return str
      .replace("clubManager", "club manager")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const approveApplication = async (email) => {
    try {
      await axiosSecure.patch(`/admin/club-manager-applications`, { email });
    } catch (e) {
      console.error("Approve failed:", e);
    } finally {
      refetch();
      queryClient.invalidateQueries(["users"]);
      document.getElementById("approve_modal").close();
    }
  };

  const matchesSearch = (application) => {
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();
    return (
      application.name?.toLowerCase().includes(term) ||
      application.email?.toLowerCase().includes(term) ||
      application.status?.toLowerCase().includes(term)
    );
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="flex items-center gap-2 justify-between flex-col lg:flex-row">
        <h2>
          Club Manager Applications ({clubManagerApplicationsList.length})
        </h2>
        <div className="flex items-center gap-2 justify-between lg:pr-[8%]">
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

      {clubManagerApplicationsList.length < 1 ? (
        "No Applications found"
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Time</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {clubManagerApplicationsList
                  .filter(matchesSearch)
                  .map((applications) => (
                    <tr key={applications._id} className="hover:bg-base-300">
                      <td>
                        <div className="font-bold">{applications.name}</div>
                      </td>

                      <td>{applications.email}</td>

                      <td className="font-semibold">
                        {capitalizeWords(applications.status)}
                      </td>

                      <td>{applications.createdAt}</td>

                      <td>
                        {applications.status === "pending" ? (
                          <button
                            className="btn btn-xs btn-success"
                            onClick={() => {
                              setSelectedMember({
                                email: applications.email,
                                name: applications.name,
                              });
                              document
                                .getElementById("approve_modal")
                                .showModal();
                            }}
                          >
                            Approve
                          </button>
                        ) : (
                          <div className="tooltip" data-tip="Already approved">
                            <button className="btn btn-xs" disabled>
                              Approved
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <dialog id="approve_modal" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Approve Application</h3>

              <p className="py-4">
                Approve application for{" "}
                <span className="font-semibold">{selectedMember?.name}</span> (
                <span className="font-semibold">{selectedMember?.email}</span>)
                as Club Manager?
              </p>

              <div className="modal-action">
                <button
                  className="btn btn-success"
                  onClick={() => approveApplication(selectedMember.email)}
                >
                  Approve
                </button>

                <form method="dialog">
                  <button className="btn">Close</button>
                </form>
              </div>
            </div>
          </dialog>
        </>
      )}
    </div>
  );
};

export default ClubManagerApplications;
