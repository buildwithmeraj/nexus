import React from "react";
import UsersList from "../admin/UsersList";
import ClubManagerApplications from "../admin/ClubManagerApplications";
import ClubsList from "../admin/ClubsList";

const Admin = () => {
  return (
    <div>
      <h2>Admin</h2>
      <UsersList />
      <ClubManagerApplications />
      <ClubsList />
    </div>
  );
};

export default Admin;
