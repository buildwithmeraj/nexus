import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../../contexts/AuthContext";

const AddClub = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    clubName: "",
    description: "",
    category: "",
    location: "",
    bannerImage: "",
    membershipFee: 0,
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "membershipFee" ? Number(value) : value,
    }));
  };

  // ImgBB upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const form = new FormData();
      form.append("image", file);

      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMGBB_API_KEY
        }`,
        {
          method: "POST",
          body: form,
        }
      );

      const data = await res.json();

      if (data.success) {
        setFormData((prev) => ({
          ...prev,
          bannerImage: data.data.url,
        }));
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Image upload failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Image upload error");
    } finally {
      setUploading(false);
    }
  };

  // Submit to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.bannerImage) {
      return toast.error("Please upload a banner image");
    }

    setSubmitting(true);

    try {
      const token = await user.getIdToken();

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/clubs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to add club");
        return;
      }

      toast.success("Club submitted successfully!");

      // Reset form
      setFormData({
        clubName: "",
        description: "",
        category: "",
        location: "",
        bannerImage: "",
        membershipFee: 0,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit club.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-base-100 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Add New Club</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="clubName"
          value={formData.clubName}
          onChange={handleChange}
          placeholder="Club Name"
          className="input input-bordered w-full"
          required
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="textarea textarea-bordered w-full"
          required
        />

        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category (e.g., Photography, Sports)"
          className="input input-bordered w-full"
          required
        />

        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location (City/Area)"
          className="input input-bordered w-full"
          required
        />

        {/* ImgBB file upload */}
        <div>
          <label className="block mb-1 font-medium">Banner Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="file-input file-input-bordered w-full"
          />
          {uploading && (
            <p className="text-sm text-gray-500 mt-1">Uploading...</p>
          )}
          {formData.bannerImage && (
            <img
              src={formData.bannerImage}
              alt="Banner Preview"
              className="mt-2 rounded-md w-full max-h-60 object-cover"
            />
          )}
        </div>

        <input
          type="number"
          name="membershipFee"
          value={formData.membershipFee}
          onChange={handleChange}
          placeholder="Membership Fee (0 for free)"
          className="input input-bordered w-full"
          min={0}
          required
        />

        <button
          type="submit"
          className="btn btn-primary mt-4 w-full"
          disabled={uploading || submitting}
        >
          {submitting ? "Submitting..." : "Add Club"}
        </button>
      </form>
    </div>
  );
};

export default AddClub;
