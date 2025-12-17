import React from "react";
import { motion } from "framer-motion";

const AnimatedCard = ({ children, delay = 0, whileHover = true, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay,
        ease: "easeOut",
      }}
      whileHover={
        whileHover ? { y: -8, boxShadow: "0 20px 25px rgba(0,0,0,0.1)" } : {}
      }
      viewport={{ once: true, amount: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
