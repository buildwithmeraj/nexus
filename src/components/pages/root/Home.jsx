import React from "react";
import PageTransition from "../../animations/PageTransition";
import Hero from "../../home/Hero";
import FeaturesSection from "../../home/Features";
import HowItWorks from "../../home/HowItWorks";
import PopularCategories from "../../home/PopularCategories";
import AllClubs from "./AllClubs";
import AllEvents from "./AllEvents";
import CTA from "../../home/CTA";

const Home = () => {
  return (
    <PageTransition>
      <Hero />
      <FeaturesSection />
      <HowItWorks />

      {/* Featured Clubs */}
      <section className="py-20 bg-base-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">
            Featured Clubs
          </h2>
          <AllClubs limit={6} />
        </div>
      </section>

      {/* <PopularCategories /> */}

      {/* Featured Events */}
      <section className="py-20 bg-base-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">
            Upcoming Events
          </h2>
          <AllEvents limit={8} />
        </div>
      </section>
      <CTA />
    </PageTransition>
  );
};

export default Home;
