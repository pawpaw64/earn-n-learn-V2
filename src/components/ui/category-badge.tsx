import React from 'react';
import { Badge } from '@/components/ui/badge';
import { getCategoryConfig } from '@/lib/categories';

interface CategoryBadgeProps {
  category: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  variant?: 'default' | 'outline';
  className?: string;
}

export default function CategoryBadge({ 
  category, 
  size = 'sm', 
  showIcon = true, 
  variant = 'default',
  className = '' 
}: CategoryBadgeProps) {
  const config = getCategoryConfig(category);
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  const baseClasses = variant === 'outline' 
    ? `border-2 bg-background ${config.textColor} border-current`
    : `${config.bgColor} ${config.textColor} border-transparent`;

  return (
    <Badge 
      className={`${baseClasses} ${sizeClasses[size]} font-medium ${className}`}
      style={{ 
        borderColor: variant === 'outline' ? config.color : undefined 
      }}
    >
      {showIcon && <span className="mr-1">{config.icon}</span>}
      {config.name}
    </Badge>
  );
}