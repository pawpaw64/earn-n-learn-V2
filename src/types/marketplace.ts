
export interface JobType {
  id: number;
  title: string;
  type: string;
  description: string;
  payment: string;
  poster: string;
  posterEmail?: string;
  posterAvatar?: string;
  location?: string;
  deadline?: string;
  requirements?: string;
  created_at?: string;
}

export interface SkillType {
  id: number;
  name: string;
  skill: string;
  pricing: string;
  description?: string;
  email?: string;
  avatarUrl?: string;
  experienceLevel?: string;
  availability?: string;
}
export interface MaterialType {
  id: number;
  name: string;
  material: string;
  condition: string;
  price: string;
  availability: string;
  description?: string;
  email?: string;
  avatarUrl?: string;
  duration?: string;
  location?: string;
  imageUrl?: string;
}
