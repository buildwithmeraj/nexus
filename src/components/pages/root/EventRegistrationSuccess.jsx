import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router";
import useAxiosSecureInstance from "../../../hooks/useSecureAxiosInstance";
import { useAuth } from "../../../contexts/AuthContext";
import toast from "react-hot-toast";
import { FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

export default function EventRegistrationSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecureInstance();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const verificationStarted = useRef(false);

  useEffect(() => {
    const verificationKey = `event_verified_${searchParams.get("sessionId")}`;

    if (sessionStorage.getItem(verificationKey)) {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        navigate(`/events/${searchParams.get("eventId")}`);
      }, 1500);
      return;
    }

    if (verificationStarted.current) return;

    const verifyRegistration = async () => {
      try {
        const eventId = searchParams.get("eventId");
        const sessionId = searchParams.get("sessionId");

        if (!sessionId || !eventId) {
          throw new Error("Missing session or event information");
        }

        const res = await axiosSecure.post(
          "/events/verify-registration-session",
          { sessionId }
        );

        if (res.data.success || res.data.alreadyRegistered) {
          sessionStorage.setItem(verificationKey, "true");
          toast.success("Event registration successful!");
          setSuccess(true);

          setTimeout(() => {
            navigate(`/events/${eventId}`);
          }, 1500);
        } else {
          throw new Error(res.data.message || "Unknown error");
        }
      } catch (error) {
        console.error(error);
        toast.error(
          error.response?.data?.message || "Failed to verify registration"
        );
        setSuccess(false);
        setTimeout(() => {
          navigate("/events");
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      verificationStarted.current = true;
      verifyRegistration();
    }
  }, [user, searchParams, axiosSecure, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-lg font-semibold">
            Verifying your registration...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {success ? (
          <>
            <div className="flex items-center justify-center text-6xl mb-4 text-success">
              <FaCheckCircle />
            </div>
            <h1 className="text-3xl font-bold text-green-600 mb-4">
              Registration Successful!
            </h1>
            <p className="text-gray-600 mb-6">
              You're all set! Redirecting you back to the event...
            </p>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center text-6xl mb-4 text-error">
              <MdCancel />
            </div>
            <h1 className="text-3xl font-bold text-red-600 mb-4">
              Registration Failed
            </h1>
            <p className="text-gray-600 mb-6">
              Something went wrong. Redirecting you back...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
