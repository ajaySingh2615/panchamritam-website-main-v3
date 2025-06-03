import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SocialLink = ({ social, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      role="listitem"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay * 0.001, duration: 0.3 }}
      style={{ animationDelay: `${delay}ms` }}
    >
      <a 
        href={social.url}
        className="group relative text-gray-300 hover:text-white transition-all duration-500 transform hover:scale-125 hover:-translate-y-2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label={`Follow us on ${social.name}`}
        rel="noopener noreferrer"
        target="_blank"
      >
        <div className="relative">
          <i 
            className={`${social.icon} text-xl transition-all duration-500 group-hover:rotate-12`}
            style={{
              filter: isHovered ? `drop-shadow(0 0 10px ${social.hoverColor})` : 'none'
            }}
          ></i>
          
          {/* Animated background glow */}
          <motion.div 
            className={`absolute inset-0 bg-${social.color}-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
            animate={isHovered ? {
              scale: [1, 1.2, 1],
              opacity: [0, 0.5, 0]
            } : {}}
            transition={{
              duration: 0.6,
              repeat: isHovered ? Infinity : 0,
              repeatType: "reverse"
            }}
          />
        </div>
        
        {/* Tooltip */}
        <motion.span 
          className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 ${social.bgColor} px-2 py-1 rounded text-white whitespace-nowrap pointer-events-none`}
          initial={{ y: 10, opacity: 0 }}
          animate={isHovered ? { y: 0, opacity: 1 } : { y: 10, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {social.name}
        </motion.span>
      </a>
    </motion.div>
  );
};

export default SocialLink; 