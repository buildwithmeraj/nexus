import React from "react";
import UsersList from "../admin/UsersList";
import ClubManagerApplications from "../admin/ClubManagerApplications";

const Admin = () => {
  return (
    <div>
      <h2>Admin</h2>
      <UsersList />
      <ClubManagerApplications />
    </div>
  );
};

export default Admin;
