export const CATEGORIES = {
  ACADEMIC_HELP: 'academic_help',
  CODING: 'coding', 
  DESIGN: 'design',
  MARKETING: 'marketing',
  FREELANCE: 'freelance'
} as const;

export type CategoryType = typeof CATEGORIES[keyof typeof CATEGORIES];

export interface CategoryConfig {
  id: CategoryType;
  label: string;
  color: string;
  backgroundColor: string;
  icon: string;
}

export const CATEGORY_CONFIG: Record<CategoryType, CategoryConfig> = {
  [CATEGORIES.ACADEMIC_HELP]: {
    id: CATEGORIES.ACADEMIC_HELP,
    label: 'Academic Help',
    color: 'hsl(220, 98%, 61%)', // Blue
    backgroundColor: 'hsl(220, 98%, 95%)',
    icon: 'graduation-cap'
  },
  [CATEGORIES.CODING]: {
    id: CATEGORIES.CODING,
    label: 'Coding',
    color: 'hsl(142, 76%, 36%)', // Green
    backgroundColor: 'hsl(142, 76%, 95%)',
    icon: 'code'
  },
  [CATEGORIES.DESIGN]: {
    id: CATEGORIES.DESIGN,
    label: 'Design',
    color: 'hsl(262, 83%, 58%)', // Purple
    backgroundColor: 'hsl(262, 83%, 95%)',
    icon: 'palette'
  },
  [CATEGORIES.MARKETING]: {
    id: CATEGORIES.MARKETING,
    label: 'Marketing',
    color: 'hsl(25, 95%, 53%)', // Orange
    backgroundColor: 'hsl(25, 95%, 95%)',
    icon: 'megaphone'
  },
  [CATEGORIES.FREELANCE]: {
    id: CATEGORIES.FREELANCE,
    label: 'Freelance',
    color: 'hsl(340, 82%, 52%)', // Pink
    backgroundColor: 'hsl(340, 82%, 95%)',
    icon: 'briefcase'
  }
};

export const getCategoryConfig = (categoryId: CategoryType | string): CategoryConfig => {
  return CATEGORY_CONFIG[categoryId as CategoryType] || CATEGORY_CONFIG[CATEGORIES.FREELANCE];
};

export const getAllCategories = (): CategoryConfig[] => {
  return Object.values(CATEGORY_CONFIG);
};