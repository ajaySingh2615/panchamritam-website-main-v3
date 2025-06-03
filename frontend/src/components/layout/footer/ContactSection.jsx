import React from 'react';
import { motion } from 'framer-motion';
import { footerConfig } from './config';
import SectionHeader from './components/SectionHeader';
import ContactItem from './components/ContactItem';

const ContactSection = () => {
  const { business } = footerConfig;

  const contactItems = [
    {
      id: 'phone',
      icon: 'fas fa-phone',
      href: `tel:${business.phone}`,
      title: business.phone,
      subtitle: '24/7 Customer Support',
      delay: 0
    },
    {
      id: 'email',
      icon: 'fas fa-envelope',
      href: `mailto:${business.email}`,
      title: business.email,
      subtitle: 'We reply within 24hrs',
      delay: 100
    },
    {
      id: 'address',
      icon: 'fas fa-map-marker-alt',
      href: '#',
      title: business.address.street,
      subtitle: business.address.postal,
      extraAction: {
        text: 'Get Directions',
        icon: 'fas fa-external-link-alt'
      },
      delay: 200
    }
  ];

  return (
    <motion.div 
      className="group/section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <SectionHeader
        icon="fas fa-phone"
        title="Get In Touch"
        animationType="pulse"
      />
      
      <div className="space-y-4" role="list" aria-label="Contact information">
        {contactItems.map((item) => (
          <ContactItem key={item.id} item={item} />
        ))}
      </div>

      {/* Business Hours */}
      <motion.div 
        className="mt-8 pt-6 border-t border-white/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <h5 className="text-white font-medium mb-4 flex items-center text-sm">
          <i className="fas fa-clock mr-2 text-green-300"></i>
          Business Hours
        </h5>
        <div className="text-sm text-green-100 space-y-1">
          <p>
            <span className="text-white">Mon-Fri:</span> {business.hours.weekdays}
          </p>
          <p>
            <span className="text-white">Sat:</span> {business.hours.saturday}
          </p>
          <p>
            <span className="text-white">Sun:</span> {business.hours.sunday}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ContactSection; 