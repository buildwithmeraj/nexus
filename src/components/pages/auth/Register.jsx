import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { NavLink, useNavigate, useLocation } from "react-router";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Error from "../../../components/utilities/Error";
import { FcGoogle } from "react-icons/fc";
import { UserRoundPlus, LogIn } from "lucide-react";

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

const Register = () => {
  const {
    registerUsingEmail,
    signInUsingGoogle,
    setUser,
    user,
    firebaseErrors,
    updateUserProfile,
    addUserToDB,
  } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  // redirect if already logged in
  useEffect(() => {
    if (user && user.email) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  // react-hook-form setup
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError: setFormError,
  } = useForm({
    mode: "onSubmit",
  });

  // watch file input for preview
  const watchedPhoto = watch("photoFile");
  const [photoPreview, setPhotoPreview] = useState(null);
  useEffect(() => {
    const file = watchedPhoto && watchedPhoto[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  }, [watchedPhoto]);

  const [uploading, setUploading] = useState(false);
  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
  const passRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
  const NameRegex = /([a-z\s]+)/i;

  const uploadPhotoToImgbb = async (file) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", file);
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error("Failed to upload image");
      }
      const data = await response.json();
      setUploading(false);
      return data.data.url;
    } catch (err) {
      console.error("Image upload error:", err);
      setUploading(false);
      throw err;
    }
  };

  const onSubmit = async (formData) => {
    try {
      const email = (formData.email || "").trim();
      const password = (formData.password || "").trim();
      const displayName = (formData.name || "").trim();
      const photoFile = formData.photoFile && formData.photoFile[0];

      if (!emailRegex.test(email)) {
        return setFormError("root", {
          type: "manual",
          message: "Please enter a valid email address",
        });
      }
      if (!passRegex.test(password)) {
        return setFormError("root", {
          type: "manual",
          message:
            "Password must include uppercase, lowercase letters, and be at least 6 characters.",
        });
      }
      if (!NameRegex.test(displayName)) {
        return setFormError("root", {
          type: "manual",
          message: "Please enter a valid name",
        });
      }

      let photoURL = "";
      if (photoFile) {
        try {
          photoURL = await uploadPhotoToImgbb(photoFile);
        } catch (err) {
          return setFormError("root", {
            type: "manual",
            message: "Failed to upload photo. Please try again.",
          });
        }
      }

      const userCredential = await registerUsingEmail(email, password);
      await updateUserProfile({ displayName, photoURL });
      setUser(userCredential.user);

      const newUser = {
        name: displayName,
        email,
        photoURL,
        createdAt: new Date(),
        role: "member",
      };

      await addUserToDB(newUser);

      toast.success("Registration Successful, Redirecting...");
      navigate(location.state?.from || "/", { replace: true });
    } catch (error) {
      const match = firebaseErrors.find((err) => err.code === error.code);
      const errMsg = match
        ? match.message
        : "Registration failed. Please try again.";
      setFormError("root", { type: "manual", message: errMsg });
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInUsingGoogle();
      setUser(result.user);

      const newUser = {
        name: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        createdAt: new Date(),
        role: "member",
      };

      await addUserToDB(newUser);

      toast.success("Connected with Google, Redirecting...");
      navigate(location.state?.from || "/", { replace: true });
    } catch (error) {
      const match = firebaseErrors.find((err) => err.code === error.code);
      const errMsg = match ? match.message : "Login failed. Please try again.";
      setFormError("root", { type: "manual", message: errMsg });
    }
  };

  return (
    <div className="hero min-h-[84vh]">
      <title>Register - {import.meta.env.VITE_SITE_NAME}</title>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="hero-content flex-col">
          <div className="card bg-base-100 w-[320px] md:w-lg lg:w-xl shadow-2xl rounded-xl">
            <div className="card-body">
              <h2>Register</h2>
              {errors.root && <Error message={errors.root.message} />}

              <fieldset className="fieldset">
                <label className="label">Email</label>
                <input
                  type="email"
                  className="input w-full"
                  placeholder="Email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: emailRegex,
                      message: "Please enter a valid email address",
                    },
                  })}
                />
                <label className="label">Name</label>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="Your Name"
                  {...register("name", { required: "Name is required" })}
                />
                <label className="label">Profile Photo</label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    className="file-input file-input-bordered w-full"
                    {...register("photoFile")}
                  />
                  {photoPreview && (
                    <div className="relative w-24 h-24">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <label className="label">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    className="input w-full"
                    placeholder="Password"
                    {...register("password", {
                      required: "Password is required",
                      pattern: {
                        value: passRegex,
                        message:
                          "Password must include uppercase, lowercase letters, and be at least 6 characters.",
                      },
                    })}
                  />
                </div>

                <button
                  className="btn btn-primary mt-4"
                  type="submit"
                  disabled={uploading}
                >
                  <UserRoundPlus size={16} />
                  {uploading ? "Processing..." : "Register"}
                </button>

                <div className="flex flex-col md:flex-row items-center justify-between gap-2 lg:mt-2">
                  <button
                    className="btn btn-block btn-outline lg:flex-1"
                    type="button"
                    onClick={handleGoogleSignUp}
                  >
                    <FcGoogle />
                    Connect with Google
                  </button>
                  <NavLink
                    to="/login"
                    className="btn btn-success text-white flex btn-block lg:flex-1 items-center gap-2"
                  >
                    <LogIn size={16} />
                    Login
                  </NavLink>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
