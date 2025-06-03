import React from 'react';
import { motion } from 'framer-motion';

const ContactItem = ({ item }) => {
  const isAddress = item.id === 'address';

  return (
    <motion.div 
      className="group relative overflow-hidden flex items-start space-x-3 hover:bg-gradient-to-r hover:from-white/10 hover:to-transparent p-3 rounded-lg transition-all duration-500 transform hover:scale-105 hover:translate-x-2 hover:shadow-[0_0_25px_rgba(34,197,94,0.4)]"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: item.delay * 0.001, duration: 0.4 }}
      style={{ animationDelay: `${item.delay}ms` }}
      role="listitem"
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/5 to-green-500/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
      
      {/* Icon */}
      <motion.i 
        className={`${item.icon} text-green-300 w-5 ${isAddress ? 'mt-1' : ''} group-hover:scale-125 group-hover:text-white group-hover:rotate-12 transition-all duration-500 relative z-10`}
        whileHover={{
          filter: "drop-shadow(0 0 10px rgba(34,197,94,0.8))"
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 flex-1">
        <a 
          href={item.href}
          className="text-white hover:text-green-300 transition-colors duration-200 font-medium relative group/link block"
          aria-label={`Contact us at ${item.title}`}
        >
          <span className="group-hover:animate-pulse">{item.title}</span>
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-blue-400 group-hover/link:w-full transition-all duration-500"></span>
        </a>
        
        <p className="text-green-100 text-sm group-hover:text-white transition-colors duration-300">
          {item.subtitle}
        </p>
        
        {/* Extra action for address */}
        {item.extraAction && (
          <motion.a 
            href="#" 
            className="text-green-300 hover:text-white text-sm transition-colors duration-200 inline-flex items-center mt-1 group/action"
            whileHover={{ x: 5 }}
          >
            <span className="relative">
              <span className="group-hover/action:animate-bounce">
                {item.extraAction.text}
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-blue-400 group-hover/action:w-full transition-all duration-500"></span>
            </span>
            <motion.i 
              className={`${item.extraAction.icon} ml-1 text-xs transition-all duration-500`}
              whileHover={{
                x: 5,
                scale: 1.1
              }}
            />
          </motion.a>
        )}
      </div>
    </motion.div>
  );
};

export default ContactItem; 