import React from "react";
import { motion } from "framer-motion";
import {
  FaUserPlus,
  FaSearch,
  FaCalendarAlt,
  FaHandshake,
} from "react-icons/fa";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      icon: FaUserPlus,
      title: "Create Your Account",
      description:
        "Sign up with your email and create your profile. It takes just 2 minutes to get started on Nexus.",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      number: "02",
      icon: FaSearch,
      title: "Discover Clubs",
      description:
        "Browse through hundreds of clubs using our advanced search and filter options. Find communities that match your interests.",
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      number: "03",
      icon: FaCalendarAlt,
      title: "Join & Attend Events",
      description:
        "Join your favorite clubs and register for exclusive events. Connect with like-minded people and build relationships.",
      color: "text-info",
      bgColor: "bg-info/10",
    },
    {
      number: "04",
      icon: FaHandshake,
      title: "Grow Your Network",
      description:
        "Participate in activities, make friends, and grow within your community. Your journey starts here!",
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const stepVariants = {
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

  const numberVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 0.1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const iconVariants = {
    initial: { scale: 1 },
    whileHover: {
      scale: 1.2,
      rotate: 10,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <section className="py-20 bg-base-50">
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
            How <span className="text-primary">Nexus</span> Works
          </h2>
          <p className="text-lg text-base-content/60 max-w-2xl mx-auto">
            Get started in 4 simple steps and join a thriving community of
            passionate individuals.
          </p>
        </motion.div>

        {/* Steps Container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                variants={stepVariants}
                whileHover="whileHover"
                className="relative group"
              >
                {/* Background Number */}
                <motion.div
                  variants={numberVariants}
                  className="absolute -top-8 -right-4 text-9xl font-black text-base-content/40 pointer-events-none z-10"
                >
                  {step.number}
                </motion.div>

                {/* Card */}
                <div className="relative bg-base-100 border border-base-300 rounded-xl p-8 h-full hover:shadow-xl transition-shadow">
                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-6 w-12 h-0.5 bg-gradient-to-r from-primary to-transparent"></div>
                  )}

                  {/* Icon */}
                  <motion.div
                    variants={iconVariants}
                    whileHover="whileHover"
                    className={`${step.bgColor} ${step.color} w-16 h-16 rounded-lg flex items-center justify-center mb-6`}
                  >
                    <Icon className="text-2xl" />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-base-content/70 text-sm leading-relaxed">
                    {step.description}
                  </p>

                  {/* Step Badge */}
                  <div className="mt-6 inline-block">
                    <span className="badge badge-lg badge-primary">
                      Step {step.number.trim()}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
