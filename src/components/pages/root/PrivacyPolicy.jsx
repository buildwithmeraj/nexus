import React from "react";
import { motion } from "framer-motion";
import {
  FaShieldAlt,
  FaDatabase,
  FaLock,
  FaUserSecret,
  FaFileAlt,
} from "react-icons/fa";

const PrivacyPolicy = () => {
  const sections = [
    {
      title: "1. Information We Collect",
      content: [
        "We collect information you provide directly, such as when you create an account, including your name, email address, phone number, and profile information.",
        "We automatically collect certain information about your device and how you interact with our platform, including IP address, browser type, and usage data.",
      ],
      icon: FaDatabase,
    },
    {
      title: "2. How We Use Your Information",
      content: [
        "To provide, maintain, and improve our services",
        "To communicate with you about your account and activities",
        "To process payments and send related information",
        "To send promotional communications (with your consent)",
        "To comply with legal obligations",
      ],
      icon: FaShieldAlt,
    },
    {
      title: "3. Data Security",
      content: [
        "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.",
        "Your account information is protected by a password that you should keep confidential. We recommend using a strong, unique password.",
      ],
      icon: FaLock,
    },
    {
      title: "4. Information Sharing",
      content: [
        "We do not sell, trade, or rent your personal information to third parties.",
        "We may share information with service providers who assist us in operating our website and conducting our business, subject to confidentiality agreements.",
        "We may disclose information if required by law or in response to legal process.",
      ],
      icon: FaUserSecret,
    },
    {
      title: "5. Cookies & Tracking",
      content: [
        "We use cookies and similar tracking technologies to enhance your experience on our platform.",
        "You can control cookie settings through your browser preferences.",
        "Some functionality may be limited if cookies are disabled.",
      ],
      icon: FaFileAlt,
    },
    {
      title: "6. Your Rights",
      content: [
        "You have the right to access, update, or delete your personal information by logging into your account.",
        "You may opt out of receiving promotional communications at any time.",
        "You have the right to request a copy of your data in a portable format.",
      ],
      icon: FaShieldAlt,
    },
    {
      title: "7. Third-Party Links",
      content: [
        "Our platform may contain links to third-party websites. We are not responsible for their privacy practices.",
        "We encourage you to review the privacy policies of any third-party sites before providing your information.",
      ],
      icon: FaDatabase,
    },
    {
      title: "8. Policy Updates",
      content: [
        "We may update this privacy policy from time to time. Changes will be effective immediately upon posting.",
        "We will notify you of significant changes via email or prominent notice on our platform.",
      ],
      icon: FaFileAlt,
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

  const sectionVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-50 via-base-100 to-base-50 py-20">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-lg text-base-content/60">
            We value your privacy and are committed to protecting your personal
            information
          </p>
          <p className="text-sm text-base-content/40 mt-4">
            Last Updated: December 18, 2025
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={index}
                variants={sectionVariants}
                className="bg-base-100 border border-base-300 rounded-xl p-8 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <Icon className="text-success text-2xl shrink-0 mt-1" />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                    <div className="space-y-3">
                      {section.content.map((item, idx) => (
                        <p
                          key={idx}
                          className="text-base-content/70 leading-relaxed"
                        >
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12 p-6 bg-success/5 border border-success/20 rounded-xl text-center"
        >
          <p className="text-base-content/70">
            If you have any questions about this Privacy Policy, please{" "}
            <a href="mailto:privacy@nexus.com" className="link link-success">
              contact us
            </a>
            .
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
