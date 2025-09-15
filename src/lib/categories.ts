// Centralized category configuration
export const CATEGORIES = {
  'Academic Help': {
    id: 'academic-help',
    name: 'Academic Help',
    color: 'hsl(var(--chart-1))', // Blue
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    textColor: 'text-blue-800 dark:text-blue-200',
    icon: '📚',
    description: 'Educational support, tutoring, research assistance'
  },
  'Coding': {
    id: 'coding',
    name: 'Coding',
    color: 'hsl(var(--chart-2))', // Green
    bgColor: 'bg-green-100 dark:bg-green-900/20',
    textColor: 'text-green-800 dark:text-green-200',
    icon: '💻',
    description: 'Programming, web development, software engineering'
  },
  'Design': {
    id: 'design',
    name: 'Design',
    color: 'hsl(var(--chart-3))', // Purple
    bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    textColor: 'text-purple-800 dark:text-purple-200',
    icon: '🎨',
    description: 'UI/UX, graphic design, visual content creation'
  },
  'Marketing': {
    id: 'marketing',
    name: 'Marketing',
    color: 'hsl(var(--chart-4))', // Orange
    bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    textColor: 'text-orange-800 dark:text-orange-200',
    icon: '📈',
    description: 'Digital marketing, social media, content strategy'
  },
  'Freelance': {
    id: 'freelance',
    name: 'Freelance',
    color: 'hsl(var(--chart-5))', // Teal
    bgColor: 'bg-teal-100 dark:bg-teal-900/20',
    textColor: 'text-teal-800 dark:text-teal-200',
    icon: '💼',
    description: 'Business services, consulting, project management'
  }
} as const;

export type CategoryKey = keyof typeof CATEGORIES;

export const CATEGORY_KEYS = Object.keys(CATEGORIES) as CategoryKey[];

export const getCategoryConfig = (category: string) => {
  return CATEGORIES[category as CategoryKey] || CATEGORIES['Academic Help'];
};

export const getCategoryOptions = () => {
  return CATEGORY_KEYS.map(key => ({
    value: key,
    label: key,
    ...CATEGORIES[key]
  }));
};