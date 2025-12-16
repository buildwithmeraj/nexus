import React from "react";
import Clubs from "./Clubs";
import AllEvents from "./AllEvents";

const Home = () => {
  return (
    <div>
      <h2>New Clubs</h2>
      <Clubs limit={4} />
      <h2>Recent Events</h2>
      <AllEvents limit={4} />
    </div>
  );
};

export default Home;
