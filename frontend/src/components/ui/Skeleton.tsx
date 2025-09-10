"use client";

import React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
  rounded?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  width = "100%",
  height = "1rem",
  rounded = false,
  ...props
}) => {
  return (
    <div
      className={`animate-pulse bg-gray-200 ${rounded ? "rounded-full" : "rounded"} ${className}`}
      style={{ width, height }}
      {...props}
    />
  );
};

export default Skeleton;
