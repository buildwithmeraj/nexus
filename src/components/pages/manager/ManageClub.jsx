import React, { useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router";
import toast from "react-hot-toast";
import useAxiosSecureInstance from "../../../hooks/useSecureAxiosInstance";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FaArrowLeft,
  FaCalendar,
  FaUsers,
  FaExclamationTriangle,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import ClubEvents from "./ClubEvents";
import LoadingDashboard from "../../utilities/LoadingDashboard";

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

  const uploadImageToImgBB = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!data.success) throw new Error("Image upload failed");
    return data.data.url;
  };

  const updateMutation = useMutation({
    mutationFn: async (updatedData) => {
      const res = await axiosSecure.patch(`/clubs/${clubId}`, updatedData);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Club updated");
      setEditMode(false);
      setPreviewImage(null);
      queryClient.invalidateQueries(["club", clubId]);
    },
    onError: () => toast.error("Update failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: async () => axiosSecure.delete(`/clubs/${clubId}`),
    onSuccess: () => {
      toast.success("Club deleted");
      navigate("/dashboard/manager/clubs");
    },
    onError: () => toast.error("Delete failed"),
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = e.target;

    let bannerImage = club.bannerImage;
    if (form.bannerImage.files[0]) {
      bannerImage = await uploadImageToImgBB(form.bannerImage.files[0]);
    }

    updateMutation.mutate({
      clubName: form.clubName.value,
      description: form.description.value,
      category: form.category.value,
      location: form.location.value,
      membershipFee: Number(form.membershipFee.value),
      bannerImage,
    });
  };

  if (!clubId) return <Navigate to="/dashboard/manager/clubs" replace />;
  if (isLoading) return <LoadingDashboard />;
  if (isError)
    return (
      <div className="alert alert-error">
        <FaExclamationTriangle />
        Failed to load club
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-neutral btn-sm gap-2"
        >
          <FaArrowLeft /> Back
        </button>

        {!editMode && (
          <div className="flex gap-2">
            <button
              className="btn btn-primary btn-sm gap-1"
              onClick={() => setEditMode(true)}
            >
              <FaEdit size={14} />
              Edit
            </button>
            <button
              className="btn btn-error btn-sm gap-1"
              onClick={() => {
                setSelectedClub({ id: club._id, name: club.clubName });
                setShowDeleteModal(true);
              }}
            >
              <FaTrash size={14} />
              Delete
            </button>
          </div>
        )}
      </div>

      {!editMode && (
        <div className="card lg:card-side bg-base-100 shadow-md">
          <figure className="lg:w-1/2">
            <img
              src={club.bannerImage}
              alt="Club Banner"
              className="h-85 w-full object-cover"
            />
          </figure>

          <div className="card-body space-y-4">
            <div>
              <h2 className="card-title">{club.clubName}</h2>
              <p className="text-sm">{club.description}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="badge badge-outline">{club.category}</span>
              <span className="badge badge-outline">{club.location}</span>
              <span className="badge badge-primary">${club.membershipFee}</span>
              <span className="badge badge-info">{club.status}</span>
            </div>

            <div className="card-actions text-xs pt-2">
              Managed by {club.managerEmail}
            </div>
          </div>
        </div>
      )}

      {editMode && (
        <form onSubmit={handleUpdate} className="card bg-base-100 shadow-md">
          <div className="card-body space-y-6">
            <h2 className="text-xl font-bold">Edit Club</h2>

            <div className="space-y-2">
              <img
                src={previewImage || club.bannerImage}
                alt="Club banner preview"
                className="h-80 w-full object-contain rounded-lg"
              />
              <label className="label">
                <span className="label-text font-medium">Club Banner</span>
              </label>
              <input
                type="file"
                name="bannerImage"
                className="file-input file-input-bordered w-full"
                onChange={(e) =>
                  setPreviewImage(URL.createObjectURL(e.target.files[0]))
                }
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Club Name</span>
                  </label>
                  <input
                    name="clubName"
                    defaultValue={club.clubName}
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Category</span>
                  </label>
                  <input
                    name="category"
                    defaultValue={club.category}
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Membership Fee ($)</span>
                  </label>
                  <input
                    type="number"
                    name="membershipFee"
                    defaultValue={club.membershipFee}
                    className="input input-bordered w-full"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Location</span>
                  </label>
                  <input
                    name="location"
                    defaultValue={club.location}
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Description</span>
                  </label>
                  <textarea
                    name="description"
                    defaultValue={club.description}
                    className="textarea textarea-bordered w-full min-h-[120px]"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end flex-col sm:flex-row gap-3 ">
              <div>
                <button className="btn btn-primary flex-1 mr-2" type="submit">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="btn flex-1"
                  onClick={() => {
                    setEditMode(false);
                    setPreviewImage(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {showDeleteModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-error">Delete Club</h3>
            <p className="py-3 text-sm">
              This will permanently delete{" "}
              <span className="font-semibold">{selectedClub?.name}</span>.
            </p>
            <div className="modal-action">
              <button
                className="btn btn-error"
                onClick={() => deleteMutation.mutate()}
              >
                Delete
              </button>
              <button
                className="btn btn-neutral"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ClubEvents />
    </div>
  );
};

export default ManageClub;
