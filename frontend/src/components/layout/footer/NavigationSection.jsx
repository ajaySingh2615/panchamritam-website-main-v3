import React from 'react';
import { motion } from 'framer-motion';
import { navigationLinks, categories } from './config';
import AnimatedLink from './components/AnimatedLink';
import SectionHeader from './components/SectionHeader';

const NavigationSection = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
      {/* Quick Links */}
      <motion.div 
        className="group/section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <SectionHeader
          icon="fas fa-compass"
          title="Quick Links"
          animationType="spin"
        />
        
        <ul className="space-y-4" role="navigation" aria-label="Quick navigation links">
          {navigationLinks.map((link, index) => (
            <AnimatedLink
              key={link.id}
              to={link.path}
              icon={link.icon}
              delay={index * 50}
              variant="default"
            >
              {link.name}
            </AnimatedLink>
          ))}
        </ul>
      </motion.div>

      {/* Categories */}
      <motion.div 
        className="group/section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <SectionHeader
          icon="fas fa-tags"
          title="Categories"
          animationType="pulse"
        />
        
        <ul className="space-y-4" role="navigation" aria-label="Product categories">
          {categories.map((category, index) => (
            <AnimatedLink
              key={category.id}
              to={category.path}
              icon={category.icon}
              delay={index * 50}
              variant="category"
              badge={category.badge}
              hoverColor={category.hoverColor}
            >
              {category.name}
            </AnimatedLink>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

export default NavigationSection; 