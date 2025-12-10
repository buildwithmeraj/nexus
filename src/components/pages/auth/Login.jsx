import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { NavLink, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ErrorMsg from "../../../components/utilities/Error";
import Info from "../../../components/utilities/Info";
import { Eye, EyeOff, UserRoundPlus, LogIn } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const {
    user,
    signInUsingEmail,
    signInUsingGoogle,
    setUser,
    firebaseErrors,
    addUserToDB,
  } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  const [showPass, setShowPass] = useState(false);
  const [loginMessage, setLoginMessage] = useState(state?.message || null);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm({
    mode: "onSubmit",
  });

  useEffect(() => {
    if (state?.message && !loginMessage) {
      setLoginMessage(state.message);
    }
  }, [state?.message, loginMessage]);

  useEffect(() => {
    if (user?.email) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // Handle email/password login
  const onSubmit = async (formData) => {
    const { email, password } = formData;

    try {
      const userCredential = await signInUsingEmail(email, password);

      const newUser = {
        name: userCredential.user.displayName,
        email: userCredential.user.email,
        photoURL: userCredential.user.photoURL,
        createdAt: new Date(),
      };

      setUser(userCredential.user);
      await addUserToDB(newUser);

      toast.success("Login successful!");
      navigate(state?.from || "/", { replace: true });
    } catch (error) {
      const match = firebaseErrors.find((err) => err.code === error.code);
      const errorMessage = match
        ? match.message
        : "Login failed. Please try again.";

      setFormError("root", {
        type: "manual",
        message: errorMessage,
      });
    }
  };

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInUsingGoogle();

      setUser(result.user);

      const googleUser = {
        name: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        createdAt: new Date(),
      };
      await addUserToDB(googleUser);

      toast.success("Login successful!");
      navigate(state?.from || "/", { replace: true });
    } catch (error) {
      const match = firebaseErrors.find((err) => err.code === error.code);
      const errorMessage = match
        ? match.message
        : "Login failed. Please try again.";

      setFormError("root", {
        type: "manual",
        message: errorMessage,
      });
    }
  };

  return (
    <div className="hero min-h-[84vh]">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="hero-content flex-col">
          <div className="card bg-base-100 w-[320px] md:w-lg lg:w-xl shadow-2xl">
            <div className="card-body">
              <h2 className="text-2xl font-bold text-center">Login</h2>

              {loginMessage && <Info message={loginMessage} />}
              {errors.root && <ErrorMsg message={errors.root.message} />}

              <fieldset className="fieldset">
                <label className="label font-medium" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className={`input w-full ${
                    errors.email ? "input-error" : ""
                  }`}
                  placeholder="Enter your email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
                      message: "Please enter a valid email address",
                    },
                  })}
                />
                {errors.email && (
                  <span className="text-error text-sm mt-1">
                    {errors.email.message}
                  </span>
                )}

                <label className="label font-medium mt-2" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    id="password"
                    className={`input w-full pr-10 ${
                      errors.password ? "input-error" : ""
                    }`}
                    placeholder="Enter your password"
                    {...register("password", {
                      required: "Password is required",
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
                        message:
                          "Password must include uppercase, lowercase letters, and be at least 6 characters.",
                      },
                    })}
                  />
                  <span
                    className="absolute right-2 top-2 cursor-pointer text-2xl text-gray-600"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? <Eye /> : <EyeOff />}
                  </span>
                </div>
                {errors.password && (
                  <span className="text-error text-sm mt-1">
                    {errors.password.message}
                  </span>
                )}

                <button className="btn btn-primary mt-4 w-full" type="submit">
                  <LogIn size={16} />
                  Login
                </button>

                <div className="flex flex-col md:flex-row items-center justify-between gap-2 lg:mt-2">
                  <button
                    className="btn btn-outline btn-block lg:flex-1"
                    type="button"
                    onClick={handleGoogleSignIn}
                  >
                    <FcGoogle />
                    Google Login
                  </button>
                  <NavLink
                    to="/register"
                    className="btn btn-success text-white flex btn-block lg:flex-1 items-center gap-2"
                  >
                    <UserRoundPlus size={16} />
                    Register
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

export default Login;
