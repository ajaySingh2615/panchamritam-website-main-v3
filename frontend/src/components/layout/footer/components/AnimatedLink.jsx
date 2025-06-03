import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AnimatedLink = ({ 
  to, 
  href,
  icon, 
  children, 
  delay = 0,
  variant = 'default',
  className = '',
  badge = null,
  hoverColor = 'rgba(34,197,94,0.3)',
  ...props 
}) => {
  const baseClasses = "group relative text-green-100 hover:text-white transition-all duration-500 flex items-center p-2 rounded-lg hover:bg-white/5";
  const shadowClasses = `hover:shadow-[0_0_20px_${hoverColor}]`;
  
  const variants = {
    default: "space-x-3",
    category: "justify-between",
    simple: "space-x-2"
  };

  const LinkComponent = to ? Link : 'a';
  const linkProps = to ? { to } : { href: href || '#' };

  return (
    <motion.li 
      className="group/item transform transition-all duration-300 hover:translate-x-3 hover:scale-105"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: delay * 0.05 }}
      style={{ animationDelay: `${delay}ms` }}
    >
      <LinkComponent 
        {...linkProps}
        className={`${baseClasses} ${variants[variant]} ${shadowClasses} ${className}`}
        {...props}
      >
        <div className="flex items-center space-x-3">
          {icon && (
            <i className={`${icon} w-4 text-green-300 group-hover:text-white group-hover:scale-125 group-hover:rotate-12 group-hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.8)] transition-all duration-500`}></i>
          )}
          
          <span className="relative overflow-hidden">
            <span className="block group-hover:animate-bounce">{children}</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-blue-400 group-hover:w-full transition-all duration-500"></span>
          </span>
        </div>
        
        {badge && (
          <Badge badge={badge} />
        )}
        
        {variant !== 'simple' && (
          <i className="fas fa-arrow-right text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-500 text-green-300"></i>
        )}
      </LinkComponent>
    </motion.li>
  );
};

const Badge = ({ badge }) => {
  const colorMap = {
    green: 'bg-green-500/20 text-green-300 group-hover:bg-green-400/30',
    blue: 'bg-blue-500/20 text-blue-300 group-hover:bg-blue-400/30',
    purple: 'bg-purple-500/20 text-purple-300 group-hover:bg-purple-400/30',
    orange: 'bg-orange-500/20 text-orange-300 group-hover:bg-orange-400/30'
  };

  const shadowMap = {
    green: 'group-hover:shadow-[0_0_10px_rgba(34,197,94,0.5)]',
    blue: 'group-hover:shadow-[0_0_10px_rgba(59,130,246,0.5)]',
    purple: 'group-hover:shadow-[0_0_10px_rgba(168,85,247,0.5)]',
    orange: 'group-hover:shadow-[0_0_10px_rgba(251,146,60,0.5)]'
  };

  return (
    <span className={`
      ${colorMap[badge.color]} 
      ${shadowMap[badge.color]}
      text-xs px-2 py-1 rounded-full 
      group-hover:text-white group-hover:scale-110 group-hover:rotate-3 
      transition-all duration-500
    `}>
      {badge.text}
    </span>
  );
};

export default AnimatedLink; 