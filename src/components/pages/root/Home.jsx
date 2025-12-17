import React from "react";
import AllClubs from "./AllClubs";
import AllEvents from "./AllEvents";

const Home = () => {
  return (
    <div>
      <h2>New Clubs</h2>
      <AllClubs limit={4} />
      <h2>Recent Events</h2>
      <AllEvents limit={4} />
    </div>
  );
};

export default Home;
