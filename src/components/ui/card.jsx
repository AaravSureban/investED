import React from "react";

export const Card = ({ children, className = "", ...props }) => {
  return (
    <div {...props} className={`shadow-lg rounded-md overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

export const CardContent = ({ children, className = "", ...props }) => {
  return (
    <div {...props} className={`p-4 ${className}`}>
      {children}
    </div>
  );
};