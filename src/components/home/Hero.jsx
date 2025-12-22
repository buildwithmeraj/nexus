import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { FaArrowRight, FaSearch, FaUsers, FaCalendarAlt } from "react-icons/fa";

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: -20,
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    },
  };

  return (
    <section className="py-10 flex items-center">
      <div className="mx-auto px-4 w-full backdrop-blur-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="space-y-6"
          >
            <motion.h2
              variants={itemVariants}
              className="text-4xl font-bold leading-tight"
            >
              Join Amazing <span className="text-primary">Clubs</span> & Events
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-lg text-base-content/70 leading-relaxed max-w-xl"
            >
              Discover communities that match your interests, attend exclusive
              events, and connect with like-minded people. Your next adventure
              starts here.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/clubs" className="btn btn-primary btn-lg gap-2 group">
                Explore Clubs
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/events" className="btn btn-outline btn-lg gap-2 group">
                Browse Events
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-4 pt-4 border-t border-base-300"
            >
              <div>
                <p className="text-2xl font-bold text-primary">40+</p>
                <p className="text-sm text-base-content/60">Active Members</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-success">10+</p>
                <p className="text-sm text-base-content/60">Clubs</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-info">30+</p>
                <p className="text-sm text-base-content/60">Events</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            variants={imageVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="hidden lg:block"
          >
            <motion.div
              variants={floatingVariants}
              initial="initial"
              animate="animate"
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl p-8 border border-primary/20">
                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-primary/20 rounded-xl p-6 text-center"
                  >
                    <FaUsers className="text-4xl text-primary mx-auto mb-3" />
                    <p className="font-semibold">Community</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-success/20 rounded-xl p-6 text-center"
                  >
                    <FaCalendarAlt className="text-4xl text-success mx-auto mb-3" />
                    <p className="font-semibold">Events</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-info/20 rounded-xl p-6 text-center"
                  >
                    <FaSearch className="text-4xl text-info mx-auto mb-3" />
                    <p className="font-semibold">Discovery</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-warning/20 rounded-xl p-6 text-center"
                  >
                    <span className="text-4xl mx-auto mb-3 block">🎯</span>
                    <p className="font-semibold">Goals</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
