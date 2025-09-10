"use client";

import React from "react";

type Variant = "default" | "primary" | "secondary" | "success" | "warning" | "error" | "info";
type Size = "sm" | "md" | "lg";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
  size?: Size;
}

const badgeVariants: Record<Variant, string> = {
  default: "bg-gray-100 text-gray-800",
  primary: "bg-indigo-100 text-indigo-800",
  secondary: "bg-slate-100 text-slate-800",
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  error: "bg-red-100 text-red-800",
  info: "bg-blue-100 text-blue-800",
};

const sizeVariants: Record<Size, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
  lg: "px-3 py-1.5 text-base",
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  className = "",
  variant = "default",
  size = "md",
  ...props
}) => {
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium transition-colors ${badgeVariants[variant]} ${sizeVariants[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
