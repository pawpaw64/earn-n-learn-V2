import React from 'react';
import { Badge } from '@/components/ui/badge';
import { getCategoryConfig, CategoryType } from '@/constants/categories';
import { icons } from 'lucide-react';

interface CategoryBadgeProps {
  category: CategoryType | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export function CategoryBadge({ 
  category, 
  size = 'md', 
  showIcon = true, 
  className = '' 
}: CategoryBadgeProps) {
  const config = getCategoryConfig(category);
  const IconComponent = icons[config.icon as keyof typeof icons] || icons.Tag;
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5', 
    lg: 'text-base px-4 py-2'
  };
  
  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };
  
  return (
    <Badge 
      className={`${sizeClasses[size]} ${className} inline-flex items-center gap-1.5 font-medium border`}
      style={{
        color: config.color,
        backgroundColor: config.backgroundColor,
        borderColor: config.color + '40'
      }}
    >
      {showIcon && (
        <IconComponent size={iconSizes[size]} className="flex-shrink-0" />
      )}
      <span>{config.label}</span>
    </Badge>
  );
}