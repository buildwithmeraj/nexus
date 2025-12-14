import React, { useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router";
import toast from "react-hot-toast";
import useAxiosSecureInstance from "../../../hooks/useSecureAxiosInstance";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Loading from "../../utilities/Loading";
import {
  FaArrowLeft,
  FaCalendar,
  FaUsers,
  FaExclamationTriangle,
} from "react-icons/fa";
import ClubEvents from "./ClubEvents";

const ManageClub = () => {
  const { id: clubId } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecureInstance();
  const queryClient = useQueryClient();

  const [editMode, setEditMode] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedClub, setSelectedClub] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const imgbbKey = import.meta.env.VITE_IMGBB_API_KEY;

  // Fetch club data
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

  // Image upload
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

  // Update mutation
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

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      return await axiosSecure.delete(`/clubs/${clubId}`);
    },
    onSuccess: () => {
      toast.success("Club deleted successfully");
      setShowDeleteModal(false);
      navigate("/dashboard/manager/clubs");
    },
    onError: () => toast.error("Failed to delete club"),
  });

  // Update form submit
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
    return <Navigate to="/dashboard/manager/clubs" replace />;
  }

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <div className="alert alert-error">
        <FaExclamationTriangle />
        <span>Failed to load club</span>
      </div>
    );

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard/manager/clubs")}
            className="btn btn-ghost btn-circle btn-sm"
            title="Go back"
          >
            <FaArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-3xl font-bold">Manage Club</h1>
            <p className="text-gray-600 text-sm">{club?.clubName}</p>
          </div>
        </div>

        {/* View Mode */}
        {!editMode && (
          <div className="space-y-6">
            {/* Club Banner & Info */}
            <div className="bg-base-100 rounded-lg overflow-hidden border border-base-300 shadow-md">
              {/* Banner Image */}
              <img
                src={club?.bannerImage}
                alt="Club Banner"
                className="w-full h-80 object-cover"
              />

              {/* Club Info */}
              <div className="p-6 space-y-4">
                <div>
                  <h2 className="text-2xl font-bold">{club?.clubName}</h2>
                  <p className="text-gray-600 text-sm mt-1">
                    {club?.description}
                  </p>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-base-200 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Category</p>
                    <p className="font-semibold">{club?.category}</p>
                  </div>

                  <div className="bg-base-200 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Location</p>
                    <p className="font-semibold">{club?.location}</p>
                  </div>

                  <div className="bg-base-200 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Membership Fee</p>
                    <p className="font-bold text-lg text-primary">
                      ${club?.membershipFee}
                    </p>
                  </div>

                  <div className="bg-base-200 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <span className="badge badge-info badge-lg">
                      {club?.status}
                    </span>
                  </div>
                </div>

                {/* Manager Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Manager Email</p>
                  <p className="font-semibold">{club?.managerEmail}</p>
                </div>

                {/* Quick Stats */}
                {club?.memberCount !== undefined && (
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-base-300">
                    <div className="flex items-center gap-2">
                      <FaUsers className="text-primary text-xl" />
                      <div>
                        <p className="text-sm text-gray-600">Members</p>
                        <p className="text-xl font-bold">
                          {club?.memberCount || 0}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCalendar className="text-success text-xl" />
                      <div>
                        <p className="text-sm text-gray-600">Events</p>
                        <p className="text-xl font-bold">
                          {club?.eventCount || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                className="btn btn-primary flex-1 gap-2"
                onClick={() => setEditMode(true)}
              >
                Edit Club
              </button>

              <button
                className="btn btn-error flex-1 gap-2"
                onClick={() => {
                  setSelectedClub({ id: club?._id, name: club?.clubName });
                  setShowDeleteModal(true);
                }}
              >
                Delete Club
              </button>
            </div>
          </div>
        )}

        {/* Edit Mode */}
        {editMode && (
          <form
            onSubmit={handleUpdate}
            className="bg-base-100 rounded-lg border border-base-300 shadow-md overflow-hidden"
          >
            <div className="p-6 space-y-6">
              <h2 className="text-2xl font-bold">Edit Club Details</h2>

              {/* Banner Image */}
              <div className="space-y-3">
                <label className="label">
                  <span className="label-text font-semibold">Banner Image</span>
                </label>

                <img
                  src={previewImage || club?.bannerImage}
                  alt="Preview"
                  className="w-full h-60 object-cover rounded-lg border border-base-300"
                />

                <input
                  type="file"
                  name="bannerImage"
                  accept="image/*"
                  className="file-input file-input-bordered w-full"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      setPreviewImage(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                />
                <p className="text-xs text-gray-500">
                  Recommended size: 1200x400px
                </p>
              </div>

              {/* Club Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Club Name</span>
                </label>
                <input
                  type="text"
                  name="clubName"
                  defaultValue={club?.clubName}
                  className="input input-bordered"
                  required
                  disabled={updateMutation.isPending}
                />
              </div>

              {/* Description */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Description</span>
                </label>
                <textarea
                  name="description"
                  defaultValue={club?.description}
                  className="textarea textarea-bordered h-24"
                  required
                  disabled={updateMutation.isPending}
                />
              </div>

              {/* Category */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Category</span>
                </label>
                <input
                  type="text"
                  name="category"
                  defaultValue={club?.category}
                  className="input input-bordered"
                  required
                  disabled={updateMutation.isPending}
                />
              </div>

              {/* Location */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Location</span>
                </label>
                <input
                  type="text"
                  name="location"
                  defaultValue={club?.location}
                  className="input input-bordered"
                  required
                  disabled={updateMutation.isPending}
                />
              </div>

              {/* Membership Fee */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Membership Fee ($)
                  </span>
                </label>
                <input
                  type="number"
                  name="membershipFee"
                  defaultValue={club?.membershipFee}
                  min="0"
                  step="0.01"
                  className="input input-bordered"
                  required
                  disabled={updateMutation.isPending}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-base-300">
                <button
                  type="submit"
                  className="btn btn-primary flex-1"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    "Save Changes"
                  )}
                </button>

                <button
                  type="button"
                  className="btn btn-ghost flex-1"
                  onClick={() => {
                    setEditMode(false);
                    setPreviewImage(null);
                  }}
                  disabled={updateMutation.isPending}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4">
              <div className="flex items-center gap-3">
                <FaExclamationTriangle className="text-warning text-2xl" />
                <h3 className="text-lg font-bold">Delete Club</h3>
              </div>

              <p className="text-gray-700">
                Are you sure you want to delete{" "}
                <span className="font-bold text-error">
                  {selectedClub?.name}
                </span>
                ? This action is permanent and cannot be undone.
              </p>

              <div className="alert alert-warning">
                <FaExclamationTriangle />
                <span>
                  All events and memberships associated with this club will be
                  deleted
                </span>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="btn btn-ghost flex-1"
                  disabled={deleteMutation.isPending}
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteMutation.mutate()}
                  className="btn btn-error flex-1"
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    "Delete Club"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ClubEvents />
    </>
  );
};

export default ManageClub;
