import React from "react";
import PageTransition from "../../animations/PageTransition";
import Hero from "../../home/Hero";
import FeaturesSection from "../../home/Features";
import HowItWorks from "../../home/HowItWorks";
import AllClubs from "./AllClubs";
import AllEvents from "./AllEvents";
import CTA from "../../home/CTA";

const Home = () => {
  return (
    <>
      <title>Home - {import.meta.env.VITE_APP_NAME}</title>
      <PageTransition>
        <Hero />
        <FeaturesSection />
        <HowItWorks />

        <section className="py-10">
          <h2 className="pb-6 text-center">Featured Clubs</h2>
          <AllClubs limit={4} />
        </section>
        <section className="py-10">
          <h2 className="pb-6 text-center">Upcoming Events</h2>
          <AllEvents limit={4} />
        </section>
        <CTA />
      </PageTransition>
    </>
  );
};

export default Home;
