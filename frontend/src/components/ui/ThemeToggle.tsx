'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useThemeContext } from '@/contexts/ThemeContext';
import { cn } from '@/utils/cn';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeVariants = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

const iconSizeVariants = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className,
  size = 'md',
}) => {
  const { theme, toggleTheme, mounted } = useThemeContext();

  if (!mounted) {
    return (
      <div className={cn(
        'rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse',
        sizeVariants[size],
        className
      )} />
    );
  }

  const isDark = theme === 'dark';

  return (
    <motion.button
      onClick={toggleTheme}
      className={cn(
        'relative inline-flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors',
        sizeVariants[size],
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: isDark ? 180 : 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.3,
          ease: 'easeInOut',
        }}
      >
        {isDark ? (
          <Moon className={iconSizeVariants[size]} />
        ) : (
          <Sun className={iconSizeVariants[size]} />
        )}
      </motion.div>
    </motion.button>
  );
};
