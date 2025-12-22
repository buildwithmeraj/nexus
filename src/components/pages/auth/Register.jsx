import React, { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { NavLink, useNavigate, useLocation } from "react-router";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Error from "../../../components/utilities/Error";
import { FcGoogle } from "react-icons/fc";
import { FaUserPlus, FaSignInAlt } from "react-icons/fa";

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
const passRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
const nameRegex = /^[a-z\s]+$/i;

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

  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    mode: "onSubmit",
  });

  /* Redirect if logged in */
  useEffect(() => {
    if (user?.email) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  /* Photo preview */
  const photoFile = watch("photoFile")?.[0];
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    if (!photoFile) return setPhotoPreview(null);

    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(photoFile);
  }, [photoFile]);

  const uploadPhotoToImgbb = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      { method: "POST", body: formData }
    );

    if (!res.ok) throw new Error("Image upload failed");

    const data = await res.json();
    return data.data.url;
  };

  const onSubmit = async ({ email, password, name, photoFile }) => {
    try {
      let photoURL = "";

      if (photoFile?.[0]) {
        photoURL = await uploadPhotoToImgbb(photoFile[0]);
      }

      const userCredential = await registerUsingEmail(email, password);

      await updateUserProfile({
        displayName: name,
        photoURL,
      });

      setUser(userCredential.user);

      await addUserToDB({
        name,
        email,
        photoURL,
        createdAt: new Date(),
        role: "member",
      });

      toast.success("Registration successful");
      navigate(location.state?.from || "/", { replace: true });
    } catch (error) {
      const match = firebaseErrors.find((e) => e.code === error.code);
      setError("root", {
        type: "server",
        message: match?.message || "Registration failed. Please try again.",
      });
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInUsingGoogle();
      setUser(result.user);

      await addUserToDB({
        name: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        createdAt: new Date(),
        role: "member",
      });

      toast.success("Connected with Google");
      navigate(location.state?.from || "/", { replace: true });
    } catch (error) {
      const match = firebaseErrors.find((e) => e.code === error.code);
      setError("root", {
        type: "server",
        message: match?.message || "Google sign-in failed",
      });
    }
  };

  return (
    <div className="hero min-h-[84vh]">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="hero-content flex-col">
          <div className="card bg-base-100 w-[320px] md:w-lg shadow-2xl">
            <div className="card-body">
              <h2 className="text-xl font-semibold">Register</h2>

              {errors.root && <Error message={errors.root.message} />}

              {/* Email */}
              <label className="label">Email</label>
              <input
                className="input w-full"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: emailRegex,
                    message: "Enter a valid email address",
                  },
                })}
              />
              {errors.email && <Error message={errors.email.message} />}

              {/* Name */}
              <label className="label">Name</label>
              <input
                className="input w-full"
                {...register("name", {
                  required: "Name is required",
                  pattern: {
                    value: nameRegex,
                    message: "Only letters and spaces allowed",
                  },
                })}
              />
              {errors.name && <Error message={errors.name.message} />}

              {/* Photo */}
              <label className="label">Profile Photo</label>
              <input
                type="file"
                accept="image/*"
                className="file-input w-full"
                {...register("photoFile")}
              />

              {photoPreview && (
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-24 h-24 rounded-lg mt-2 object-cover"
                />
              )}

              {/* Password */}
              <label className="label">Password</label>
              <input
                type="password"
                className="input w-full"
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value: passRegex,
                    message: "Min 6 chars, with uppercase & lowercase letters",
                  },
                })}
              />
              {errors.password && <Error message={errors.password.message} />}

              <button className="btn btn-primary mt-4" disabled={isSubmitting}>
                <FaUserPlus />
                {isSubmitting ? "Processing..." : "Register"}
              </button>

              <div className="divider">OR</div>

              <button
                type="button"
                onClick={handleGoogleSignUp}
                className="btn btn-outline w-full"
              >
                <FcGoogle />
                Continue with Google
              </button>

              <NavLink to="/login" className="btn btn-ghost mt-2">
                <FaSignInAlt />
                Login
              </NavLink>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
