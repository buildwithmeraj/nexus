import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { NavLink, useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";
import ErrorMsg from "../../../components/utilities/Error";
import Info from "../../../components/utilities/Info";
import { Eye, EyeOff, UserRoundPlus, LogIn } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const { user, signInUsingEmail, signInUsingGoogle, setUser, firebaseErrors } =
    useAuth();

  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  const [error, setError] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [loginMessage, setLoginMessage] = useState(state?.message || null);
  const emailRef = useRef();

  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
  const passRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

  // Set loginMessage from state if not already set
  useEffect(() => {
    if (state?.message && !loginMessage) {
      setLoginMessage(state.message);
    }
  }, [state?.message, loginMessage]);

  // Redirect to dashboard if user is logged in
  useEffect(() => {
    if (user?.email) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleForm = (e) => {
    e.preventDefault();
    setError(null);

    const email = emailRef.current?.value.trim();
    const password = e.target.password.value.trim();

    if (!emailRegex.test(email)) {
      return setError("Please enter a valid email address");
    }
    if (!passRegex.test(password)) {
      return setError(
        "Password must include uppercase, lowercase letters, and be at least 6 characters."
      );
    }

    signInUsingEmail(email, password)
      .then((userCredential) => {
        setUser(userCredential.user);
        toast.success("Login successful!");
        navigate(state?.from || "/", { replace: true });
      })
      .catch((error) => {
        const match = firebaseErrors.find((err) => err.code === error.code);
        setError(match ? match.message : "Login failed. Please try again.");
      });
  };

  const handleGoogleSignIn = () => {
    signInUsingGoogle()
      .then((result) => {
        setUser(result.user);
        toast.success("Login successful!");
        navigate(state?.from || "/", { replace: true });
      })
      .catch((error) => {
        const match = firebaseErrors.find((err) => err.code === error.code);
        setError(match ? match.message : "Login failed. Please try again.");
      });
  };

  return (
    <div className="hero min-h-[84vh]">
      <form onSubmit={handleForm}>
        <div className="hero-content flex-col">
          <div className="card bg-base-100 w-[320px] md:w-lg lg:w-xl shadow-2xl">
            <div className="card-body">
              <h2>Login</h2>

              {loginMessage && <Info message={loginMessage} />}
              {error && <ErrorMsg message={error} />}

              <fieldset className="fieldset">
                <label className="label font-medium" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="input w-full"
                  placeholder="Enter your email"
                  name="email"
                  ref={emailRef}
                  required
                />

                <label className="label font-medium mt-2" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    id="password"
                    className="input w-full pr-10"
                    placeholder="Enter your password"
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
