import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { NavLink, useNavigate, useLocation } from "react-router";
import toast from "react-hot-toast";
import Error from "../../../components/utilities/Error";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff, UserRoundPlus, Upload, LogIn } from "lucide-react";

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

const Register = () => {
  const {
    registerUsingEmail,
    signInUsingGoogle,
    setUser,
    user,
    firebaseErrors,
    updateUserProfile,
  } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  if (user && user?.email) {
    navigate("/dashboard");
  }

  useEffect(() => {
    if (user && user.email) {
      navigate(location.state ? location.state : "/");
    }
  }, [user, location.state, navigate]);

  const [error, setError] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
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
      setUploading(false);
      setError("Failed to upload photo. Please try again.");
      return null;
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleForm = async (e) => {
    e.preventDefault();
    setError(null);
    let email = e.target.email.value;
    let password = e.target.password.value;
    let displayName = e.target.name.value;
    const photoFile = e.target.photoFile.files[0];

    if (!emailRegex.test(email)) {
      return setError("Please enter a valid email address");
    }
    if (!passRegex.test(password)) {
      return setError(
        "Password Must have at least one uppercase letter, one lowercase letter and at least 6 characters long"
      );
    }

    if (!NameRegex.test(displayName)) {
      return setError("Please enter a valid name");
    }

    let photoURL = "";
    if (photoFile) {
      photoURL = await uploadPhotoToImgbb(photoFile);
      if (!photoURL) {
        return;
      }
    }

    registerUsingEmail(email, password)
      .then((userCredential) => {
        setUser(userCredential.user);
        updateUserProfile({ displayName, photoURL });
        toast.success("Registration Successful, Redirecting to Homepage...");
        setInterval(() => {
          window.location.href = "/";
        }, 2000);
      })
      .catch((error) => {
        const errMsg = firebaseErrors.find(
          (err) => err.code === error.code
        ).message;
        setError(errMsg);
      });
  };

  const handleGoogleSignUp = () => {
    signInUsingGoogle()
      .then((result) => {
        setUser(result.user);
        toast.success("Conneccted with Google, Redirecting to Homepage...");
        setInterval(() => {
          window.location.href = "/";
        }, 2000);
      })
      .catch((error) => {
        const match = firebaseErrors.find((err) => err.code === error.code);
        const errMsg = match
          ? match.message
          : "Login failed. Please try again.";
        setError(errMsg);
      });
  };

  return (
    <div className="hero min-h-[84vh]">
      <title>Register - {import.meta.env.VITE_SITE_NAME}</title>
      <form onSubmit={handleForm}>
        <div className="hero-content flex-col">
          <div className="card bg-base-100 w-[320px] md:w-lg lg:w-xl shadow-2xl rounded-xl">
            <div className="card-body">
              <h2>Register</h2>
              {error && <Error message={error} />}
              <fieldset className="fieldset">
                <label className="label">Email</label>
                <input
                  type="email"
                  className="input w-full"
                  placeholder="Email"
                  name="email"
                  required
                />
                <label className="label">Name</label>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="Your Name"
                  name="name"
                  required
                />
                <label className="label">Profile Photo</label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    className="file-input file-input-bordered w-full"
                    name="photoFile"
                    onChange={handlePhotoChange}
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
                    type={showPass ? "text" : "password"}
                    className="input w-full"
                    placeholder="Password"
                    name="password"
                    required
                  />
                  <span
                    className="absolute right-2 top-2 cursor-pointer text-2xl text-gray-600"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? <Eye /> : <EyeOff />}
                  </span>
                </div>

                <button
                  className="btn btn-primary mt-4"
                  type="submit"
                  disabled={uploading}
                >
                  <UserRoundPlus size={16} />
                  {uploading ? "Uploading..." : "Register"}
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
