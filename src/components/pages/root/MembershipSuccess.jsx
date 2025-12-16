import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router";
import useAxiosSecureInstance from "../../../hooks/useSecureAxiosInstance";
import { useAuth } from "../../../contexts/AuthContext";
import toast from "react-hot-toast";
import { FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

export default function MembershipSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecureInstance();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [processed, setProcessed] = useState(false);
  const verificationStarted = useRef(false);

  useEffect(() => {
    // Prevent processing the same verification twice
    const verificationKey = `verified_${searchParams.get("sessionId")}`;

    if (sessionStorage.getItem(verificationKey)) {
      setProcessed(true);
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        navigate(`/clubs/${searchParams.get("clubId")}`);
      }, 1500);
      return;
    }

    // Prevent running verification twice
    if (verificationStarted.current) {
      return;
    }

    const verifyPayment = async () => {
      try {
        const clubId = searchParams.get("clubId");
        const sessionId = searchParams.get("sessionId");

        if (!sessionId || !clubId) {
          throw new Error("Missing session or club information");
        }

        const res = await axiosSecure.post("/clubs/verify-session", {
          sessionId,
        });

        if (
          res.data.success ||
          res.data.alreadyProcessed ||
          res.data.alreadyMember
        ) {
          // Mark as processed
          sessionStorage.setItem(verificationKey, "true");

          toast.success("Payment successful! Membership activated.");
          setSuccess(true);

          setTimeout(() => {
            navigate(`/clubs/${clubId}`);
          }, 1500);
        } else {
          throw new Error(res.data.message || "Unknown error");
        }
      } catch (error) {
        console.error(error);
        toast.error(
          error.response?.data?.message || "Failed to verify payment"
        );
        setSuccess(false);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      verificationStarted.current = true;
      verifyPayment();
    }
  }, [user, searchParams, axiosSecure, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-lg font-semibold">
            Verifying your payment...
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
              {processed ? "Already Processed" : "Payment Successful!"}
            </h1>
            <p className="text-gray-600 mb-6">
              Your membership has been activated. Redirecting you back...
            </p>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center text-6xl mb-4 text-error">
              <MdCancel />
            </div>
            <h1 className="text-3xl font-bold text-red-600 mb-4">
              Payment Failed
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
