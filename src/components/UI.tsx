import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className, onClick, ...props }) => (
  <motion.div
    whileTap={onClick ? { scale: 0.98 } : undefined}
    onClick={onClick}
    className={cn(
      "bg-white rounded-2xl p-4 shadow-sm border border-slate-100",
      onClick && "cursor-pointer active:bg-slate-50",
      className
    )}
    {...props}
  >
    {children}
  </motion.div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  className, 
  variant = 'primary', 
  fullWidth, 
  loading,
  ...props 
}) => {
  const variants = {
    primary: "bg-dz-green text-white hover:bg-dz-green/90",
    secondary: "bg-dz-white text-dz-green border border-dz-green hover:bg-dz-green/5",
    danger: "bg-dz-red text-white hover:bg-dz-red/90",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100"
  };

  return (
    <button
      className={cn(
        "px-6 py-3 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2",
        variants[variant],
        fullWidth && "w-full",
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : children}
    </button>
  );
};

export const Badge = ({ children, color = 'green' }: { children: React.ReactNode, color?: 'green' | 'red' | 'orange' | 'blue' }) => {
  const colors = {
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    orange: "bg-orange-100 text-orange-700",
    blue: "bg-blue-100 text-blue-700",
  };
  return (
    <span className={cn("px-2 py-0.5 rounded-full text-xs font-bold", colors[color])}>
      {children}
    </span>
  );
};
