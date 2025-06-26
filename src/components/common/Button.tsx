// src/components/common/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = 'btn-modern px-4 py-2 text-base font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-75 transition-all duration-200';
  let variantStyles = '';

  switch (variant) {
    case 'primary':
      variantStyles = 'btn-primary text-white hover:shadow-lg focus:ring-[var(--color-primary-default)]'; // Usa tus clases CSS personalizadas
      break;
    case 'secondary':
      variantStyles = 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500';
      break;
    case 'danger':
      variantStyles = 'bg-error text-white hover:bg-red-700 focus:ring-error';
      break;
    case 'outline':
      variantStyles = 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-500';
      break;
    default:
      variantStyles = 'btn-primary text-white hover:shadow-lg focus:ring-[var(--color-primary-default)]';
  }

  return (
    <button className={`${baseStyles} ${variantStyles} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;