// Footer Configuration - Centralized constants and styling
export const footerConfig = {
  // Main container styling
  containerClasses: "bg-gradient-to-br from-green-700 via-green-800 to-green-900 text-white relative overflow-hidden",
  
  // Animation delays for staggered effects
  animationDelays: {
    short: '50ms',
    medium: '100ms',
    long: '150ms',
    extraLong: '200ms',
    max: '250ms',
  },
  
  // Common hover effect classes
  hoverEffects: {
    base: "transition-all duration-500 transform hover:scale-105",
    slide: "hover:translate-x-2 hover:scale-105",
    bounce: "group-hover:animate-bounce",
    rotate: "group-hover:rotate-12",
    glow: "group-hover:drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]",
  },
  
  // Color themes for different elements
  colors: {
    primary: "green-400",
    secondary: "blue-400",
    accent: "purple-400",
    warning: "orange-400",
    error: "red-400",
  },
  
  // Business information
  business: {
    name: "Panchamritam",
    emoji: "🌿",
    description: "Authentic organic products sourced directly from nature. Bringing you the purest ingredients with sustainable practices and traditional wisdom.",
    phone: "+1 (234) 567-890",
    email: "hello@panchamritam.com",
    address: {
      street: "123 Organic Street, Natural City",
      postal: "Earth 12345"
    },
    hours: {
      weekdays: "9:00 AM - 8:00 PM",
      saturday: "10:00 AM - 6:00 PM",
      sunday: "11:00 AM - 5:00 PM"
    }
  },
  
  // Newsletter configuration
  newsletter: {
    title: "Stay Connected with Nature",
    subtitle: "Join over 10,000+ nature lovers! Get organic tips, seasonal recipes, exclusive offers, and be the first to know about new products.",
    disclaimers: "📧 No spam, unsubscribe anytime • 🎁 Get 10% off your first order",
    apiDelay: 1500, // Simulated API delay
    successMessageDuration: 3000
  }
};

// Social media links configuration
export const socialLinks = [
  {
    id: 'facebook',
    name: 'Facebook',
    icon: 'fab fa-facebook-f',
    url: '#',
    color: 'blue',
    hoverColor: 'rgba(59,130,246,0.8)',
    bgColor: 'bg-blue-600'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: 'fab fa-instagram',
    url: '#',
    color: 'pink',
    hoverColor: 'rgba(236,72,153,0.8)',
    bgColor: 'bg-gradient-to-r from-purple-500 to-pink-500'
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: 'fab fa-twitter',
    url: '#',
    color: 'cyan',
    hoverColor: 'rgba(56,178,172,0.8)',
    bgColor: 'bg-cyan-600'
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: 'fab fa-youtube',
    url: '#',
    color: 'red',
    hoverColor: 'rgba(239,68,68,0.8)',
    bgColor: 'bg-red-600'
  }
];

// Quality certifications
export const certifications = [
  {
    id: 'usda',
    name: 'USDA Organic Certified',
    icon: 'fas fa-award'
  },
  {
    id: 'iso',
    name: 'ISO 22000 Certified',
    icon: 'fas fa-award'
  }
];

// Navigation links
export const navigationLinks = [
  {
    id: 'home',
    name: 'Home',
    path: '/',
    icon: 'fas fa-home'
  },
  {
    id: 'shop',
    name: 'Shop',
    path: '/shop',
    icon: 'fas fa-store'
  },
  {
    id: 'about',
    name: 'About',
    path: '/about',
    icon: 'fas fa-leaf'
  },
  {
    id: 'blog',
    name: 'Blog',
    path: '/blog',
    icon: 'fas fa-blog'
  },
  {
    id: 'contact',
    name: 'Contact',
    path: '/contact',
    icon: 'fas fa-envelope'
  },
  {
    id: 'faq',
    name: 'FAQ',
    path: '/faq',
    icon: 'fas fa-question-circle'
  }
];

// Product categories
export const categories = [
  {
    id: 'vegetables',
    name: 'Organic Vegetables',
    path: '/categories/vegetables',
    icon: 'fas fa-carrot',
    badge: { text: 'Fresh', color: 'green' },
    hoverColor: 'rgba(34,197,94,0.3)'
  },
  {
    id: 'fruits',
    name: 'Natural Fruits',
    path: '/categories/fruits',
    icon: 'fas fa-apple-alt',
    badge: { text: 'Seasonal', color: 'blue' },
    hoverColor: 'rgba(59,130,246,0.3)'
  },
  {
    id: 'wellness',
    name: 'Wellness Products',
    path: '/categories/wellness',
    icon: 'fas fa-spa',
    badge: { text: 'Popular', color: 'purple' },
    hoverColor: 'rgba(168,85,247,0.3)'
  },
  {
    id: 'teas',
    name: 'Herbal Teas',
    path: '/categories/teas',
    icon: 'fas fa-mug-hot',
    badge: { text: 'New', color: 'orange' },
    hoverColor: 'rgba(251,146,60,0.3)'
  }
];

// Legal links
export const legalLinks = [
  { name: 'Privacy Policy', path: '/privacy' },
  { name: 'Terms of Service', path: '/terms' },
  { name: 'Shipping Policy', path: '/shipping' },
  { name: 'Returns', path: '/returns' }
];

// Payment method icons
export const paymentMethods = [
  { icon: 'fab fa-cc-visa', color: 'text-blue-400' },
  { icon: 'fab fa-cc-mastercard', color: 'text-red-400' },
  { icon: 'fab fa-cc-paypal', color: 'text-blue-500' },
  { icon: 'fab fa-google-pay', color: 'text-green-400' },
  { icon: 'fas fa-mobile-alt', color: 'text-purple-400' }
]; 