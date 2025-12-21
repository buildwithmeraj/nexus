import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../../contexts/AuthContext";
import useAxiosSecureInstance from "../../../hooks/useSecureAxiosInstance";
import { useQuery } from "@tanstack/react-query";
import LoadingDashboard from "../../utilities/LoadingDashboard";

const ApplyForClubManager = ({ onAccept }) => {
  const axiosSecure = useAxiosSecureInstance();
  const { role } = useAuth();
  const [accepted, setAccepted] = useState(false);

  const {
    data: applicationStatus = {},
    isPending,
    error,
    refetch,
  } = useQuery({
    queryKey: ["club-manager-application"],
    queryFn: async () => {
      const res = await axiosSecure.get("/member/apply-club-manager/status");
      return res.data;
    },
  });

  if (role !== "member") {
    return (
      <div className="alert alert-warning max-w-3xl mx-auto">
        Only members can apply to become a Club Manager.
      </div>
    );
  }

  if (isPending) return <LoadingDashboard />;

  if (error) {
    toast.error(error.message || "Failed to load application status");
    return null;
  }

  if (applicationStatus?.application) {
    return (
      <div className="card bg-base-100 shadow-sm max-w-3xl mx-auto">
        <div className="card-body text-center space-y-3">
          <h2 className="text-xl font-bold text-success">
            Application Submitted
          </h2>
          <p className="text-sm">
            Your request to become a Club Manager has already been submitted.
            Please wait for admin approval.
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!accepted) {
      toast.error("You must accept the terms to continue.");
      return;
    }

    try {
      await axiosSecure.post("/member/apply-club-manager");
      await refetch();
      toast.success("Application submitted successfully!");
      onAccept?.();
    } catch (err) {
      toast.error(err.message || "Failed to apply");
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="card bg-base-100 shadow-lg rounded-xl">
        <div className="card-body space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Apply for Club Manager</h2>
            <p className="text-sm mt-1">
              Please review the terms and responsibilities carefully before
              applying.
            </p>
          </div>

          <div className="space-y-4 text-sm leading-relaxed">
            <section>
              <h3 className="font-semibold text-base mb-1">1. Eligibility</h3>
              <p>
                You must be a registered member and comply with all platform
                policies and applicable laws.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-1">
                2. Responsibilities
              </h3>
              <ul className="list-disc ml-5 space-y-1">
                <li>Manage club details and memberships</li>
                <li>Create and manage events</li>
                <li>Moderate club members and enforce rules</li>
                <li>Handle memberships and payments responsibly</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-1">3. Restrictions</h3>
              <ul className="list-disc ml-5 space-y-1">
                <li>No unauthorized club management</li>
                <li>No off-platform fee collection</li>
                <li>Respect user privacy and safety</li>
                <li>No fraudulent or illegal activities</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-1">4. Liability</h3>
              <p>
                You are responsible for your club operations. Violations may
                lead to suspension or termination.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-1">5. Termination</h3>
              <p>
                You may step down at any time. The platform reserves the right
                to revoke privileges.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-1">6. Agreement</h3>
              <p>
                By applying, you confirm that you understand and agree to these
                terms.
              </p>
            </section>
          </div>

          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
              />
              <span className="label-text">
                I have read and agree to the Terms and Conditions
              </span>
            </label>
          </div>

          <div className="card-actions">
            <button
              onClick={handleSubmit}
              disabled={!accepted}
              className="btn btn-primary w-full"
            >
              Apply to Become Club Manager
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyForClubManager;
