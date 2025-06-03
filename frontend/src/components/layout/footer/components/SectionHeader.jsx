import React from 'react';
import { motion } from 'framer-motion';

const SectionHeader = ({ icon, title, animationType = 'pulse' }) => {
  const getIconAnimation = () => {
    switch (animationType) {
      case 'spin':
        return 'group-hover/section:animate-spin';
      case 'pulse':
        return 'group-hover/section:animate-pulse';
      case 'bounce':
        return 'group-hover/section:animate-bounce';
      default:
        return 'group-hover/section:animate-pulse';
    }
  };

  return (
    <motion.h4 
      className="text-lg font-semibold mb-6 flex items-center group-hover/section:text-green-300 transition-colors duration-300"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <i className={`${icon} mr-2 text-green-300 ${getIconAnimation()}`}></i>
      {title}
    </motion.h4>
  );
};

export default SectionHeader; 