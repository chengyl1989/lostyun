import React from 'react';
import { motion } from 'framer-motion';

export const LoadingSpinner: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <motion.div
      className={`w-8 h-8 border-4 border-gray-200 border-t-blue-500 dark:border-gray-700 dark:border-t-blue-400 rounded-full animate-spin ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    />
  );
};
