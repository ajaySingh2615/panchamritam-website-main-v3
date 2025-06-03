import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { footerConfig } from './config';
import { useNewsletter } from './hooks/useNewsletter';
import LoadingSpinner from './components/LoadingSpinner';

const NewsletterSection = () => {
  const { newsletter } = footerConfig;
  const {
    email,
    isSubscribing,
    handleEmailChange,
    handleSubmit,
    statusMessage,
    isValid
  } = useNewsletter();

  return (
    <motion.div 
      className="border-t border-white/20 mt-16 pt-12"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <div className="text-center max-w-2xl mx-auto">
        {/* Header */}
        <motion.h4 
          className="text-2xl font-bold mb-4 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          {newsletter.title}
          <motion.span 
            className="ml-2 text-2xl"
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            🌱
          </motion.span>
        </motion.h4>
        
        {/* Subtitle */}
        <motion.p 
          className="text-green-100 mb-8 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          {newsletter.subtitle.split('10,000+').map((part, index) => 
            index === 0 ? (
              <React.Fragment key={index}>
                {part}
                <strong className="text-white">10,000+</strong>
              </React.Fragment>
            ) : (
              part
            )
          )}
        </motion.p>
        
        {/* Newsletter Form */}
        <motion.form 
          onSubmit={handleSubmit} 
          className="max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.5 }}
        >
          <div className="flex gap-3">
            {/* Email Input */}
            <div className="flex-1 relative">
              <input 
                type="email" 
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                required
                aria-label="Email address for newsletter subscription"
                aria-describedby="newsletter-description"
                disabled={isSubscribing}
              />
              
              {/* Validation indicator */}
              <AnimatePresence>
                {email && (
                  <motion.div
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                      isValid ? 'text-green-400' : 'text-red-400'
                    }`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                  >
                    <i className={`fas ${isValid ? 'fa-check' : 'fa-times'}`}></i>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Submit Button */}
            <motion.button 
              type="submit"
              disabled={isSubscribing || !isValid}
              className="px-6 py-3 bg-white text-green-800 font-semibold rounded-lg hover:bg-green-50 transition-all duration-300 hover:scale-105 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubscribing ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Subscribing...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i>
                  <span>Subscribe</span>
                </>
              )}
            </motion.button>
          </div>
          
          {/* Status Messages */}
          <AnimatePresence>
            {statusMessage && (
              <motion.div 
                className={`mt-4 flex items-center justify-center space-x-2 ${statusMessage.className}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <i className={statusMessage.icon}></i>
                <span className="text-sm">{statusMessage.text}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>
        
        {/* Disclaimers */}
        <motion.p 
          className="text-green-300 text-xs mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.5 }}
          id="newsletter-description"
        >
          {newsletter.disclaimers}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default NewsletterSection; 