import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export default function Card({ children, className = '', onClick, hoverable }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-bg-card rounded-xl shadow-sm border border-border p-4 ${
        hoverable || onClick ? 'hover:shadow-md transition-shadow cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
