import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import {
  FaFutbol,
  FaBook,
  FaMusic,
  FaCode,
  FaCamera,
  FaHeartbeat,
  FaChess,
  FaUsers,
  FaArrowRight,
} from "react-icons/fa";

const PopularCategories = () => {
  const categories = [
    {
      name: "Sports",
      icon: FaFutbol,
      color: "from-red-500 to-red-600",
      textColor: "text-red-600",
      bgColor: "bg-red-50",
      count: "12+ Clubs",
      description: "Join sports enthusiasts and athletes",
    },
    {
      name: "Learning",
      icon: FaBook,
      color: "from-blue-500 to-blue-600",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
      count: "8+ Clubs",
      description: "Enhance your skills and knowledge",
    },
    {
      name: "Music",
      icon: FaMusic,
      color: "from-purple-500 to-purple-600",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50",
      count: "7+ Clubs",
      description: "Connect with music lovers",
    },
    {
      name: "Technology",
      icon: FaCode,
      color: "from-green-500 to-green-600",
      textColor: "text-green-600",
      bgColor: "bg-green-50",
      count: "15+ Clubs",
      description: "Tech enthusiasts and developers",
    },
    {
      name: "Photography",
      icon: FaCamera,
      color: "from-pink-500 to-pink-600",
      textColor: "text-pink-600",
      bgColor: "bg-pink-50",
      count: "6+ Clubs",
      description: "Visual storytellers unite",
    },
    {
      name: "Fitness",
      icon: FaHeartbeat,
      color: "from-orange-500 to-orange-600",
      textColor: "text-orange-600",
      bgColor: "bg-orange-50",
      count: "9+ Clubs",
      description: "Health and wellness community",
    },
    {
      name: "Gaming",
      icon: FaChess,
      color: "from-indigo-500 to-indigo-600",
      textColor: "text-indigo-600",
      bgColor: "bg-indigo-50",
      count: "11+ Clubs",
      description: "Gamers and strategy lovers",
    },
    {
      name: "Community",
      icon: FaUsers,
      color: "from-cyan-500 to-cyan-600",
      textColor: "text-cyan-600",
      bgColor: "bg-cyan-50",
      count: "20+ Clubs",
      description: "General community activities",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const categoryVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    whileHover: {
      y: -15,
      boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
      transition: {
        duration: 0.3,
      },
    },
  };

  const iconVariants = {
    initial: { rotate: 0, scale: 1 },
    whileHover: {
      rotate: [0, -10, 10, -5, 0],
      scale: 1.2,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section className="py-20 bg-base-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Popular <span className="text-primary">Categories</span>
          </h2>
          <p className="text-lg text-base-content/60 max-w-2xl mx-auto">
            Explore clubs across diverse categories. Whether you're into sports,
            technology, arts, or community service, we have something for you.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={index}
                variants={categoryVariants}
                whileHover="whileHover"
                className={`${category.bgColor} border border-base-300 rounded-xl p-6 cursor-pointer group overflow-hidden relative`}
              >
                {/* Animated Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                ></div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div
                    variants={iconVariants}
                    initial="initial"
                    whileHover="whileHover"
                    className={`${category.textColor} text-4xl mb-4`}
                  >
                    <Icon />
                  </motion.div>

                  {/* Category Name */}
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-base-content/70 mb-3">
                    {category.description}
                  </p>

                  {/* Count */}
                  <div className="flex items-center justify-between">
                    <span className="badge badge-lg badge-outline">
                      {category.count}
                    </span>
                    <motion.div
                      initial={{ x: 0 }}
                      whileHover={{ x: 5 }}
                      className={`${category.textColor}`}
                    >
                      <FaArrowRight />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link to="/clubs" className="btn btn-primary btn-lg btn-wide gap-2">
            View All Clubs
            <FaArrowRight />
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-3 gap-8 text-center bg-gradient-to-r from-primary/5 via-base-100 to-secondary/5 rounded-xl p-8"
        >
          <div>
            <p className="text-3xl font-bold text-primary">100+</p>
            <p className="text-base-content/60 text-sm mt-2">Total Clubs</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-success">500+</p>
            <p className="text-base-content/60 text-sm mt-2">Active Members</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-info">1000+</p>
            <p className="text-base-content/60 text-sm mt-2">Monthly Events</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PopularCategories;
