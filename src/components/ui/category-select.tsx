import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAllCategories, CategoryType } from '@/constants/categories';
import { icons } from 'lucide-react';

interface CategorySelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function CategorySelect({ 
  value, 
  onValueChange, 
  placeholder = "Select category",
  disabled = false 
}: CategorySelectProps) {
  const categories = getAllCategories();
  
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {categories.map((category) => {
          const IconComponent = icons[category.icon as keyof typeof icons] || icons.Tag;
          return (
            <SelectItem key={category.id} value={category.id}>
              <div className="flex items-center gap-2">
                <IconComponent 
                  size={16} 
                  style={{ color: category.color }}
                />
                <span>{category.label}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}