import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const NaturalHero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-green-700 via-green-800 to-green-900 pt-20">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(34,197,94,0.3) 0%, transparent 50%)`
          }}
          animate={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(34,197,94,0.3) 0%, transparent 50%)`
          }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Organic Shapes Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-20 -left-20 w-40 h-40 bg-green-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-60 h-60 bg-green-400/15 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 25, 0],
            scale: [1, 0.9, 1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        
        {/* Main NATURAL Typography */}
        <div className="relative mb-0">
          <motion.h2
            className="text-8xl md:text-9xl lg:text-[12rem] font-bold tracking-tight leading-none mb-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Main Text with Gradient - Letter by Letter Animation */}
            <span className="relative inline-block">
              {("NATURAL").split("").map((char, index) => (
                <motion.span
                  key={index}
                  className="bg-gradient-to-r from-green-200 via-green-100 to-green-300 bg-clip-text text-transparent inline-block"
                  style={{
                    textShadow: '0 0 40px rgba(34,197,94,0.3), 0 0 80px rgba(34,197,94,0.1)'
                  }}
                  initial={{ 
                    opacity: 0, 
                    y: 50, 
                    scale: 0.3,
                    rotateY: -90
                  }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    rotateY: 0
                  }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 120,
                    damping: 10
                  }}
                  whileHover={{
                    scale: 1.1,
                    color: "#fbbf24",
                    transition: { duration: 0.2 }
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}

              {/* Sparkle Effects */}
              <motion.div
                className="absolute -top-4 left-1/4 text-yellow-300 text-4xl"
                initial={{ opacity: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  delay: 1.5,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                ✨
              </motion.div>
              
              <motion.div
                className="absolute -bottom-4 right-1/4 text-yellow-300 text-3xl"
                initial={{ opacity: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  rotate: [0, -180, -360],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  delay: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                ⭐
              </motion.div>

              {/* Animated Glow Effect Behind Text */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-green-300/30 to-green-500/20 blur-2xl -z-10"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 3,
                  delay: 1,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            </span>
          </motion.h2>
        </div>
      </div>

      {/* Bottom Wave Transition */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="relative block w-full h-16"
        >
          <motion.path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            className="fill-green-800/50"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 1 }}
          />
        </svg>
      </div>
    </div>
  );
};

export default NaturalHero; 