import React from 'react';
import { motion } from 'framer-motion';

const CertificationItem = ({ certification, delay = 0 }) => {
  return (
    <motion.div 
      className="group flex items-center space-x-3 hover:bg-gradient-to-r hover:from-green-500/10 hover:to-transparent p-2 rounded-lg transition-all duration-500 transform hover:translate-x-2 hover:scale-105 cursor-pointer"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: delay * 0.001, duration: 0.4 }}
      style={{ animationDelay: `${delay}ms` }}
      role="listitem"
      tabIndex={0}
      aria-label={`Quality certification: ${certification.name}`}
    >
      {/* Animated indicator dot */}
      <div className="relative">
        <motion.div 
          className="w-2 h-2 bg-green-400 rounded-full group-hover:scale-150 transition-all duration-500"
          whileHover={{
            boxShadow: "0 0 15px rgba(34,197,94,0.8)",
            scale: 1.5
          }}
        />
        <motion.div 
          className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full opacity-50 group-hover:opacity-100"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>
      
      {/* Certification text */}
      <span className="text-gray-200 text-sm group-hover:text-white transition-all duration-300 group-hover:font-medium group-hover:tracking-wide">
        {certification.name}
      </span>
      
      {/* Award icon */}
      <motion.i 
        className={`${certification.icon} text-yellow-400 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110`}
        whileHover={{
          rotate: 12,
          scale: 1.2,
          filter: "drop-shadow(0 0 8px rgba(251, 191, 36, 0.6))"
        }}
      />
    </motion.div>
  );
};

export default CertificationItem; 