import React from 'react';
import { motion } from 'framer-motion';
import BrandSection from './footer/BrandSection';
import NavigationSection from './footer/NavigationSection';
import ContactSection from './footer/ContactSection';
import NewsletterSection from './footer/NewsletterSection';
import BottomBar from './footer/BottomBar';
import NaturalHero from './footer/components/NaturalHero';
import { footerConfig } from './footer/config';

const Footer = () => {
  return (
    <div className="relative">
      {/* Natural Hero Section */}
      <NaturalHero />
      
      {/* Main Footer Content */}
      <motion.footer 
        className={`${footerConfig.containerClasses} -mt-10`}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
      <div className="max-w-7xl mx-auto px-6 py-16 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <BrandSection />
            <NavigationSection />
            <ContactSection />
          </div>
          <NewsletterSection />
        </div>

        <BottomBar />
      </motion.footer>
      </div>
  );
};

export default Footer; 