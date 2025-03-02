import React from "react";

export const Button = ({ children, className = "", ...props }) => {
  return (
    <button
      {...props}
      className={`px-4 py-2 font-semibold rounded-lg transition-colors ${className}`}
    >
      {children}
    </button>
  );
};