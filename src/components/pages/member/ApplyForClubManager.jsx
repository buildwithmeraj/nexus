import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../../contexts/AuthContext";
import useAxiosSecureInstance from "../../../hooks/useSecureAxiosInstance";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../utilities/Loading";

const ApplyForClubManager = ({ onAccept }) => {
  const axiosSecure = useAxiosSecureInstance();
  const [accepted, setAccepted] = useState(false);
  const { role } = useAuth();
  const {
    data: applicationStatus = [],
    isPending,
    error,
    refetch,
  } = useQuery({
    queryKey: ["application"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users/apply-club-manager/status");
      console.log(res.data);
      return res.data;
    },
  });

  if (role !== "member") {
    return <div>Only Members can apply for club manager</div>;
  }

  const handleSubmit = () => {
    if (!accepted) {
      toast.error("You must accept the terms to continue.");
      return;
    }

    if (role !== "member") {
      toast.error("Only Members can apply for Club Manager");
      return;
    }
    axiosSecure
      .post("/users/apply-club-manager")
      .then(async () => {
        await refetch();
        toast.success(
          "You have successfully applied to become a Club Manager!"
        );
      })
      .catch((error) => {
        toast.error(error.message || "Failed to apply");
      });

    // Call the passed-in onAccept function
    onAccept && onAccept();
  };

  if (applicationStatus.application) {
    return <>Already applied</>;
  }

  if (error) {
    return toast.error(error.message);
  }

  if (isPending) return <Loading />;

  return (
    <div className="max-w-5xl mx-auto">
      <h2>Apply for Club Manager</h2>
      <p className="mb-4 text-sm text-gray-600">
        By applying to become a Club Manager, you agree to the following terms.
        Please read carefully.
      </p>

      <div className="mt-6">
        <h1 className="font-semibold text-lg mb-2">1. Eligibility</h1>
        <p>
          To become a Club Manager, you must be a registered user and comply
          with all applicable laws and site policies.
        </p>

        <h1 className="font-semibold text-lg mt-4 mb-2">2. Responsibilities</h1>
        <ul className="list-disc ml-5">
          <li>
            Manage clubs you have created: update details, oversee memberships.
          </li>
          <li>
            Host events: create, edit, delete events and manage participants.
          </li>
          <li>
            Manage club users: approve/remove members, assign roles, enforce
            rules.
          </li>
          <li>
            Payments and memberships: set fees, view payments, maintain
            transparency.
          </li>
        </ul>

        <h1 className="font-semibold text-lg mt-4 mb-2">3. Restrictions</h1>
        <ul className="list-disc ml-5">
          <li>Do not manage clubs you do not own.</li>
          <li>Do not collect fees outside the approved platform.</li>
          <li>Respect privacy and safety of members.</li>
          <li>No fraudulent or illegal activity.</li>
        </ul>

        <h1 className="font-semibold text-lg mt-4 mb-2">4. Liability</h1>
        <p>
          You are responsible for the management of your club and events. Misuse
          may result in suspension or termination of your Club Manager status.
        </p>

        <h1 className="font-semibold text-lg mt-4 mb-2">5. Termination</h1>
        <p>
          You may relinquish your Club Manager role at any time. The platform
          can revoke privileges for violations.
        </p>

        <h1 className="font-semibold text-lg mt-4 mb-2">6. Changes to Terms</h1>
        <p>
          Terms may be updated. Continued use constitutes acceptance of updated
          terms.
        </p>

        <h1 className="font-semibold text-lg mt-4 mb-2">7. Agreement</h1>
        <p>
          By applying, you acknowledge that you have read, understood, and
          agreed to these terms.
        </p>
      </div>

      <div className="flex items-center my-6">
        <input
          type="checkbox"
          id="acceptTerms"
          className="mr-2"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
        />
        <label htmlFor="acceptTerms" className="text">
          I have read and agree to the Terms and Conditions for Club Managers.
        </label>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!accepted}
        className={`btn btn-primary w-full ${
          !accepted ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        Apply to Become Club Manager
      </button>
    </div>
  );
};

export default ApplyForClubManager;
