import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { legalLinks, paymentMethods } from './config';

const BottomBar = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="border-t border-white/20 bg-black/20">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Main bottom content */}
        <motion.div 
          className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          {/* Copyright and brand */}
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
            <motion.p 
              className="text-green-100 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              &copy; {currentYear} Panchamritam. All rights reserved.
            </motion.p>
            
            <motion.div 
              className="flex items-center space-x-2 text-green-200"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4, duration: 0.5 }}
            >
              <span className="text-xs">Made with</span>
              <motion.i 
                className="fas fa-heart text-red-400 text-xs"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              <span className="text-xs">for nature lovers</span>
            </motion.div>
          </div>
          
          {/* Legal links */}
          <motion.div 
            className="flex flex-wrap justify-center lg:justify-end items-center gap-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.6, duration: 0.5 }}
          >
            {legalLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 + (index * 0.1), duration: 0.3 }}
              >
                <Link 
                  to={link.path} 
                  className="text-green-100 hover:text-white transition-colors duration-200 text-sm relative group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-blue-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        
        {/* Payment methods */}
        <motion.div 
          className="border-t border-white/10 mt-6 pt-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.6 }}
        >
          <motion.p 
            className="text-green-200 text-xs mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 0.5 }}
          >
            Secure payments powered by
          </motion.p>
          
          <div className="flex justify-center items-center space-x-6 opacity-60">
            {paymentMethods.map((method, index) => (
              <motion.i 
                key={index}
                className={`${method.icon} text-2xl ${method.color}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.6, scale: 1 }}
                transition={{ 
                  delay: 2.4 + (index * 0.1), 
                  duration: 0.3,
                  type: "spring",
                  stiffness: 200
                }}
                whileHover={{
                  opacity: 1,
                  scale: 1.2,
                  transition: { duration: 0.2 }
                }}
                aria-label={`Payment method ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BottomBar; 