import React from 'react';
import { motion } from 'framer-motion';
import { footerConfig, socialLinks, certifications } from './config';
import SocialLink from './components/SocialLink';
import CertificationItem from './components/CertificationItem';

const BrandSection = () => {
  const { business } = footerConfig;

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Brand Information */}
      <div>
        <motion.h3 
          className="text-3xl font-bold mb-6 text-white"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {business.name} {business.emoji}
        </motion.h3>
        <motion.p 
          className="text-gray-200 leading-relaxed text-base max-w-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {business.description}
        </motion.p>
      </div>

      {/* Social Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <h4 className="text-gray-300 text-sm mb-4 uppercase tracking-wide font-medium">
          Connect With Us
        </h4>
        <div 
          className="flex space-x-4"
          role="list"
          aria-label="Social media links"
        >
          {socialLinks.map((social, index) => (
            <SocialLink 
              key={social.id} 
              social={social} 
              delay={index * 100}
            />
          ))}
        </div>
      </motion.div>

      {/* Certifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <h4 className="text-gray-300 text-sm mb-4 uppercase tracking-wide font-medium">
          Quality Assured
        </h4>
        <div className="space-y-2" role="list" aria-label="Quality certifications">
          {certifications.map((cert, index) => (
            <CertificationItem 
              key={cert.id} 
              certification={cert} 
              delay={index * 100}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BrandSection; 