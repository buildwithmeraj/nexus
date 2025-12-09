import React, { useEffect, useState } from "react";
import useAxiosSecureInstance from "../../../hooks/useSecureAxiosInstance";
import Loading from "../../utilities/Loading";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecureInstance();

  useEffect(() => {
    // fetch users
    axiosSecure.get("/users").then((response) => {
      setUsers(response.data);
      setLoading(false);
    });
  }, []);

  if (loading) <Loading />;
  return (
    <div>
      <h2>User List {users.length}</h2>
      {users.map((user) => (
        <div key={user._id}>{user?.email}</div>
      ))}
    </div>
  );
};

export default UsersList;
