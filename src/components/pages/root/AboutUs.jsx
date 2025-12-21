import React from "react";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaHeart, FaLightbulb, FaUsers } from "react-icons/fa";
import { Link } from "react-router";
import { TbTargetArrow } from "react-icons/tb";

const AboutUs = () => {
  const values = [
    {
      icon: FaUsers,
      title: "Community First",
      description:
        "We believe in the power of communities to inspire, support, and transform lives.",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: FaLightbulb,
      title: "Innovation",
      description:
        "We continuously innovate to provide the best platform for clubs and events.",
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      icon: TbTargetArrow,
      title: "Accessibility",
      description:
        "We make it easy for anyone to discover and join clubs that match their interests.",
      color: "text-info",
      bgColor: "bg-info/10",
    },
    {
      icon: FaHeart,
      title: "Integrity",
      description:
        "We operate with transparency, honesty, and respect for all our users.",
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ];

  const team = [
    {
      role: "Founder & CEO",
      description:
        "Passionate about building communities and connecting people with shared interests.",
    },
    {
      role: "Lead Developer",
      description:
        "Expert in building scalable platforms with cutting-edge technology.",
    },
    {
      role: "Product Manager",
      description:
        "Dedicated to creating intuitive and user-friendly experiences.",
    },
    {
      role: "Community Manager",
      description:
        "Committed to supporting clubs and fostering a thriving community.",
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-50 via-base-100 to-base-50">
      <section className="py-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl lg:text-6xl font-bold mb-6">
              About <span className="text-primary">Nexus</span>
            </h2>
            <p className="text-xl text-base-content/60 leading-relaxed">
              Nexus is a modern platform designed to connect people with clubs
              and events they're passionate about. We believe that communities
              thrive when people can easily discover, join, and participate in
              activities that matter to them.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-10 px-4 bg-base-100">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12"
          >
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-8 border border-primary/20">
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-base-content/70 leading-relaxed">
                To empower communities by providing a seamless platform where
                people can discover, create, and participate in clubs and events
                that enrich their lives and foster meaningful connections.
              </p>
            </div>

            <div className="bg-gradient-to-br from-success/10 to-success/5 rounded-xl p-8 border border-success/20">
              <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
              <p className="text-base-content/70 leading-relaxed">
                To become the leading platform for community building, where
                every person can find their tribe, express themselves, and grow
                alongside others who share their passions.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center pb-6"
          >
            Our Core Values
          </motion.h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  className={`${value.bgColor} border border-base-300 rounded-xl p-8 text-center hover:shadow-lg transition-shadow`}
                >
                  <Icon className={`${value.color} text-4xl mx-auto mb-4`} />
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-base-content/70 text-sm">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="py-10 px-4 bg-base-100">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center pb-6"
          >
            Our Team
          </motion.h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {team.map((member, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-base-100 to-base-50 border border-base-300 rounded-xl p-8 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {member.role.charAt(0)}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2">{member.role}</h3>
                <p className="text-base-content/70 text-sm">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-3 gap-6 bg-gradient-to-r from-primary/10 via-base-100 to-secondary/10 rounded-xl p-8 border border-primary/20"
          >
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">10+</p>
              <p className="text-base-content/60 text-sm">Active Clubs</p>
            </div>
            <div className="text-center border-l border-r border-base-300">
              <p className="text-4xl font-bold text-success mb-2">40+</p>
              <p className="text-base-content/60 text-sm">Community Members</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-info mb-2">30+</p>
              <p className="text-base-content/60 text-sm">Events Hosted</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-10 px-4 bg-base-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold pb-6">Join Our Community</h2>
          <p className="text-lg text-base-content/60 mb-8">
            Be part of something bigger. Discover clubs, make new friends, and
            grow with a community that shares your passions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/events" className="btn btn-primary btn-lg">
              <FaCalendarAlt size={16} />
              Events
            </Link>
            <Link to="/clubs" className="btn btn-outline btn-lg">
              <FaUsers />
              Explore Clubs
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutUs;
