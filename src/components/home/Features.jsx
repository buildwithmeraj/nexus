import React from "react";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaUsers,
  FaCalendarAlt,
  FaCreditCard,
  FaShieldAlt,
  FaRocket,
} from "react-icons/fa";

const FeaturesSection = () => {
  const features = [
    {
      icon: FaSearch,
      title: "Easy Discovery",
      description:
        "Find clubs and events that match your interests with advanced search and filters.",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: FaUsers,
      title: "Connect & Network",
      description:
        "Meet like-minded people and build meaningful connections in your community.",
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      icon: FaCalendarAlt,
      title: "Event Management",
      description:
        "Stay updated with club events, register with ease, and never miss an opportunity.",
      color: "text-info",
      bgColor: "bg-info/10",
    },
    {
      icon: FaCreditCard,
      title: "Secure Payments",
      description:
        "Safe and secure payment processing for memberships and event registrations.",
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      icon: FaShieldAlt,
      title: "Trusted Platform",
      description:
        "Verified clubs and transparent management for a safe community experience.",
      color: "text-error",
      bgColor: "bg-error/10",
    },
    {
      icon: FaRocket,
      title: "Growing Community",
      description:
        "Join a thriving network that's constantly expanding with new clubs and events.",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    whileHover: {
      y: -10,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <section className="py-10">
      <div className="mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="mb-4">
            Why Choose <span className="text-primary">Nexus</span>?
          </h2>
          <p className="text-lg text-base-content/60 max-w-2xl mx-auto">
            Everything you need to discover, join, and manage clubs and events
            in one platform.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover="whileHover"
                className="bg-base-200/50 border border-base-300 rounded-xl p-8 cursor-pointer group"
              >
                <div
                  className={`${feature.bgColor} ${feature.color} w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="text-2xl" />
                </div>

                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-base-content/70">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
