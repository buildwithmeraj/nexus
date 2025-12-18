import React from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

const TermsOfService = () => {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: [
        "By accessing and using Nexus, you accept and agree to be bound by the terms and provision of this agreement.",
        "If you do not agree to abide by the above, please do not use this service.",
      ],
      icon: FaCheckCircle,
    },
    {
      title: "2. Use License",
      content: [
        "Permission is granted to temporarily download one copy of the materials (information or software) on Nexus for personal, non-commercial transitory viewing only.",
        "This is the grant of a license, not a transfer of title, and under this license you may not:",
        "• Modify or copy the materials",
        "• Use the materials for any commercial purpose or for any public display",
        "• Attempt to decompile or reverse engineer any software contained on Nexus",
        "• Remove any copyright or other proprietary notations from the materials",
        "• Transfer the materials to another person or 'mirror' the materials on any other server",
      ],
      icon: FaExclamationTriangle,
    },
    {
      title: "3. Disclaimer",
      content: [
        "The materials on Nexus are provided on an 'as is' basis. Nexus makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.",
      ],
      icon: FaExclamationTriangle,
    },
    {
      title: "4. Limitations",
      content: [
        "In no event shall Nexus or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Nexus.",
      ],
      icon: FaExclamationTriangle,
    },
    {
      title: "5. Accuracy of Materials",
      content: [
        "The materials appearing on Nexus could include technical, typographical, or photographic errors. Nexus does not warrant that any of the materials on its website are accurate, complete, or current.",
        "Nexus may make changes to the materials contained on its website at any time without notice.",
      ],
      icon: FaCheckCircle,
    },
    {
      title: "6. Links",
      content: [
        "Nexus has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site.",
        "The inclusion of any link does not imply endorsement by Nexus of the site. Use of any such linked website is at the user's own risk.",
      ],
      icon: FaCheckCircle,
    },
    {
      title: "7. Modifications",
      content: [
        "Nexus may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.",
      ],
      icon: FaCheckCircle,
    },
    {
      title: "8. Governing Law",
      content: [
        "These terms and conditions are governed by and construed in accordance with the laws of your country, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.",
      ],
      icon: FaCheckCircle,
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-lg text-base-content/60">
            Please read these terms carefully before using Nexus
          </p>
          <p className="text-sm text-base-content/40 mt-4">
            Last Updated: December 18, 2025
          </p>
        </motion.div>

        {/* Content */}
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
                  <Icon className="text-primary text-2xl flex-shrink-0 mt-1" />
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

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12 p-6 bg-primary/5 border border-primary/20 rounded-xl text-center"
        >
          <p className="text-base-content/70">
            If you have any questions about these Terms of Service, please{" "}
            <a href="mailto:support@nexus.com" className="link link-primary">
              contact us
            </a>
            .
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;
