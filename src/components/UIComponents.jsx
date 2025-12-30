import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({ children, variant = 'primary', className = '', onClick, ...props }) => {
  const variants = {
    primary: 'bg-cobalt hover:bg-blue-600 text-white glow-border',
    secondary: 'glass glow-border text-cobalt hover:text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white border border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.4)]',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-6 py-3 rounded-lg font-['Orbitron'] font-semibold transition-all duration-300 relative overflow-hidden group ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
    </motion.button>
  );
};

export const GlowCard = ({ children, className = '', delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
      className={`glass glow-border rounded-xl p-6 transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,71,255,0.5)] ${className}`}
    >
      {children}
    </motion.div>
  );
};

export const HUDHeading = ({ children, level = 'h2', className = '' }) => {
  const Tag = level;
  return (
    <Tag className={`hud-bracket text-4xl md:text-5xl font-bold text-glow ${className}`}>
      {children}
    </Tag>
  );
};

export const InputField = ({ label, type = 'text', placeholder, className = '', ...props }) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-['Orbitron'] mb-2 text-cobalt">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        className={`w-full px-4 py-3 glass glow-border rounded-lg focus:outline-none focus:border-cobalt focus:shadow-[0_0_30px_rgba(0,71,255,0.6)] transition-all duration-300 text-white placeholder-silver-grey/50 ${className}`}
        {...props}
      />
    </div>
  );
};

export const TextArea = ({ label, placeholder, className = '', rows = 4, ...props }) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-['Orbitron'] mb-2 text-cobalt">
          {label}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-4 py-3 glass glow-border rounded-lg focus:outline-none focus:border-cobalt focus:shadow-[0_0_30px_rgba(0,71,255,0.6)] transition-all duration-300 text-white placeholder-silver-grey/50 resize-none ${className}`}
        {...props}
      />
    </div>
  );
};

export const ScanningLine = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="w-full h-0.5 bg-gradient-to-r from-transparent via-cobalt to-transparent"
        animate={{ y: ['0%', '100%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
};
