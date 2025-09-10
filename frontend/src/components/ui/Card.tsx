"use client";

import React from "react";
import { motion } from "framer-motion";

type Padding = "sm" | "md" | "lg" | "none";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: Padding;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = true,
  padding = 'md',
  ...props
}) => {
  const paddingVariants = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    none: 'p-0',
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-lg border border-gray-200 transition-all duration-200 ${paddingVariants[padding]} ${hover ? 'hover:shadow-xl hover:-translate-y-1' : ''} ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={`mb-4 ${className || ''}`}>
    {children}
  </div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <h3 className={`text-xl font-semibold text-gray-900 ${className || ''}`}>
    {children}
  </h3>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={`text-gray-600 ${className || ''}`}>
    {children}
  </div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={`mt-4 pt-4 border-t border-gray-200 ${className || ''}`}>
    {children}
  </div>
);

export default Card;
