import React from "react";
import { motion as Motion } from "framer-motion";
import { Link } from "react-router";
import { FaHome, FaArrowLeft, FaSearch } from "react-icons/fa";
import Navbar from "../../shared/Navbar";
import Footer from "../../shared/Footer";

const NotFound = () => {
  return (
    <>
      <Navbar />
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-[78vh] bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 flex items-center justify-center px-4"
      >
        <div className="text-center">
          <Motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="mb-8"
          >
            <span className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              404
            </span>
          </Motion.div>
          <Motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl lg:text-5xl font-bold mb-4"
          >
            Oops! Page Not Found
          </Motion.h1>
          <Motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg text-base-content/60 mb-8 max-w-xl mx-auto"
          >
            Sorry, the page you're looking for doesn't exist. It might have been
            moved or deleted.
          </Motion.p>
          <Motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/" className="btn btn-primary btn-lg gap-2 group">
              <FaHome />
              Go Home
            </Link>
            <Link to="/clubs" className="btn btn-outline btn-lg gap-2 group">
              <FaSearch />
              Explore Clubs
            </Link>
            <button
              onClick={() => window.history.back()}
              className="btn btn-outline btn-lg gap-2 group"
            >
              <FaArrowLeft />
              Go Back
            </button>
          </Motion.div>
          <Motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-sm text-base-content/40 mt-12"
          >
            Error Code: 404 | {window.location.pathname}
          </Motion.p>        </div>
      </Motion.div>      <Footer />
    </>
  );
};

export default NotFound;
