import React, { useState } from "react";
import { useParams, Navigate, Link } from "react-router";
import toast from "react-hot-toast";
import useAxiosSecureInstance from "../../../hooks/useSecureAxiosInstance";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Loading from "../../utilities/Loading";
import ClubEvents from "./ClubEvents";

const ManageClub = () => {
  const { id: clubId } = useParams();
  const axiosSecure = useAxiosSecureInstance();
  const queryClient = useQueryClient();

  const [editMode, setEditMode] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedClub, setSelectedClub] = useState(null);
  const [activeTab, setActiveTab] = useState("details"); // "details" or "events"

  const imgbbKey = import.meta.env.VITE_IMGBB_API_KEY;

  // -----------------------------
  // FETCH CLUB DATA
  // -----------------------------
  const {
    data: club,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["club", clubId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/clubs/${clubId}`);
      return res.data;
    },
  });

  // -----------------------------
  // IMAGE UPLOAD
  // -----------------------------
  const uploadImageToImgBB = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const uploadRes = await fetch(
      `https://api.imgbb.com/1/upload?key=${imgbbKey}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await uploadRes.json();
    if (!data.success) throw new Error("Image upload failed");
    return data.data.url;
  };

  // -----------------------------
  // UPDATE MUTATION
  // -----------------------------
  const updateMutation = useMutation({
    mutationFn: async ({ updatedData }) => {
      const res = await axiosSecure.patch(`/clubs/${clubId}`, updatedData);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Club updated successfully");
      setEditMode(false);
      queryClient.invalidateQueries(["club", clubId]);
    },
    onError: () => toast.error("Failed to update club"),
  });

  // -----------------------------
  // DELETE MUTATION
  // -----------------------------
  const deleteMutation = useMutation({
    mutationFn: async () => {
      return await axiosSecure.delete(`/clubs/${clubId}`);
    },
    onSuccess: () => {
      toast.success("Club deleted successfully");
      document.getElementById("delete_club_modal").checked = false;
      return <Navigate to="/dashboard/club-manager" replace />;
    },
    onError: () => toast.error("Failed to delete club"),
  });

  // -----------------------------
  // UPDATE FORM SUBMIT
  // -----------------------------
  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = e.target;

    let bannerImageURL = club.bannerImage;

    if (form.bannerImage.files[0]) {
      bannerImageURL = await uploadImageToImgBB(form.bannerImage.files[0]);
    }

    const updatedClub = {
      clubName: form.clubName.value,
      description: form.description.value,
      category: form.category.value,
      location: form.location.value,
      membershipFee: Number(form.membershipFee.value),
      bannerImage: bannerImageURL,
    };

    updateMutation.mutate({ updatedData: updatedClub });
  };

  if (!clubId) {
    toast.error("Invalid Club ID");
    return <Navigate to="/dashboard/club-manager" replace />;
  }
  if (isLoading) return <Loading />;
  if (isError) return <p className="text-red-500">Failed to load club</p>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Manage Club</h2>

      {/* Tab Navigation */}
      <div className="tabs tabs-bordered">
        <button
          className={`tab ${activeTab === "details" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("details")}
        >
          Club Details
        </button>
        <button
          className={`tab ${activeTab === "events" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("events")}
        >
          Events
        </button>
      </div>

      {/* Details Tab */}
      {activeTab === "details" && (
        <>
          {/* ------------------------- VIEW MODE ------------------------- */}
          {!editMode && (
            <div className="space-y-4 border rounded-xl p-5 bg-base-100 shadow">
              <img
                src={club.bannerImage}
                alt="Banner"
                className="rounded-lg max-h-56 object-cover w-full"
              />

              <h3 className="text-xl font-bold">{club.clubName}</h3>

              <div className="space-y-2 text-sm">
                <p>
                  <strong>Description:</strong> {club.description}
                </p>
                <p>
                  <strong>Category:</strong> {club.category}
                </p>
                <p>
                  <strong>Location:</strong> {club.location}
                </p>
                <p>
                  <strong>Membership Fee:</strong> ${club.membershipFee}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className="badge badge-info">{club.status}</span>
                </p>
                <p>
                  <strong>Manager:</strong> {club.managerEmail}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex justify-between mt-4">
                <button
                  className="btn btn-primary"
                  onClick={() => setEditMode(true)}
                >
                  Edit Club
                </button>

                <label
                  htmlFor="delete_club_modal"
                  className="btn btn-error"
                  onClick={() =>
                    setSelectedClub({
                      id: club._id,
                      name: club.clubName,
                    })
                  }
                >
                  Delete Club
                </label>
              </div>
            </div>
          )}

          {/* ------------------------- EDIT MODE ------------------------- */}
          {editMode && (
            <form
              onSubmit={handleUpdate}
              className="space-y-4 border rounded-xl p-5 bg-base-100 shadow"
            >
              <h3 className="text-xl font-bold mb-2">Edit Club</h3>

              {/* IMAGE PREVIEW */}
              <div className="space-y-2">
                <label className="label">Banner Image</label>

                <img
                  src={previewImage || club.bannerImage}
                  className="rounded-lg max-h-40 object-cover"
                />

                <input
                  type="file"
                  name="bannerImage"
                  accept="image/*"
                  className="file-input file-input-bordered w-full"
                  onChange={(e) =>
                    setPreviewImage(URL.createObjectURL(e.target.files[0]))
                  }
                />
              </div>

              {/* FORM FIELDS */}
              <div>
                <label className="label">Club Name</label>
                <input
                  type="text"
                  name="clubName"
                  defaultValue={club.clubName}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div>
                <label className="label">Description</label>
                <textarea
                  name="description"
                  defaultValue={club.description}
                  className="textarea textarea-bordered w-full"
                  required
                />
              </div>

              <div>
                <label className="label">Category</label>
                <input
                  type="text"
                  name="category"
                  defaultValue={club.category}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div>
                <label className="label">Location</label>
                <input
                  type="text"
                  name="location"
                  defaultValue={club.location}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div>
                <label className="label">Membership Fee</label>
                <input
                  type="number"
                  name="membershipFee"
                  defaultValue={club.membershipFee}
                  min="0"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              {/* BUTTONS */}
              <div className="flex justify-between mt-3">
                <button type="submit" className="btn btn-primary">
                  {updateMutation.isLoading ? "Saving..." : "Save Changes"}
                </button>

                <button
                  className="btn"
                  type="button"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* ------------------------- DELETE MODAL ------------------------- */}
          <input
            type="checkbox"
            id="delete_club_modal"
            className="modal-toggle"
          />
          <div className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg text-red-600">Delete Club</h3>

              <p className="py-4">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{selectedClub?.name}</span>?
                This action is permanent.
              </p>

              <div className="modal-action">
                <label
                  className="btn btn-error"
                  onClick={() => deleteMutation.mutate()}
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
        </>
      )}

      {/* Events Tab */}
      {activeTab === "events" && <ClubEvents />}
    </div>
  );
};

export default ManageClub;
