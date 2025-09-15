import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { getCategoryOptions } from '@/lib/categories';

interface CategorySelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  variant?: 'select' | 'buttons';
  className?: string;
}

export default function CategorySelector({
  value,
  onValueChange,
  placeholder = "Select category",
  required = false,
  variant = 'select',
  className = ''
}: CategorySelectorProps) {
  const categories = getCategoryOptions();

  if (variant === 'buttons') {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 ${className}`}>
        {categories.map((category) => (
          <Button
            key={category.value}
            type="button"
            variant={value === category.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onValueChange(category.value)}
            className={`justify-start ${
              value === category.value 
                ? `${category.bgColor} ${category.textColor}` 
                : 'hover:bg-muted'
            }`}
          >
            <span className="mr-2">{category.icon}</span>
            {category.name}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <Select value={value} onValueChange={onValueChange} required={required}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {categories.map((category) => (
          <SelectItem key={category.value} value={category.value}>
            <div className="flex items-center gap-2">
              <span>{category.icon}</span>
              <div>
                <div className="font-medium">{category.name}</div>
                <div className="text-xs text-muted-foreground">{category.description}</div>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}