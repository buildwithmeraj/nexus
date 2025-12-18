import React from "react";
import { motion } from "framer-motion";

const CTA = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      viewport={{ once: true }}
      className="text-center bg-gradient-to-r from-primary/10 via-base-100 to-secondary/10 rounded-2xl p-8 border border-primary/20"
    >
      <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
      <p className="text-base-content/60 mb-6 max-w-md mx-auto">
        Join thousands of members already discovering amazing clubs and events
        on Nexus.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="/register" className="btn btn-primary btn-lg">
          Sign Up Now
        </a>
        <a href="/clubs" className="btn btn-outline btn-lg">
          Explore Clubs
        </a>
      </div>
    </motion.div>
  );
};

export default CTA;
