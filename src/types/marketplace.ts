
// Job types
export interface JobType {
  id: number;
  title: string;
  type: string;
  description: string;
  payment: string;
  poster?: string;
  posterEmail?: string;
  posterAvatar?: string;
  location?: string;
  deadline?: string;
  requirements?: string;
  created_at?: string;
}

// Skill types
export interface SkillType {
  id: number;
  name?: string;
  skill?: string;
  skill_name?: string;
  pricing: string;
  description?: string;
  email?: string;
  avatarUrl?: string;
  experienceLevel?: string;
  availability?: string;
}

// Material types
export interface MaterialType {
  id: number;
  name?: string;
  material?: string;
  title?: string;
  condition?: string;
  conditions?: string;
  price: string;
  availability: string;
  description?: string;
  email?: string;
  avatarUrl?: string;
  duration?: string;
  location?: string;
  imageUrl?: string;
}

// Application types
export interface ApplicationType {
  id: number;
  job_id: number;
  user_id: number;
  title: string;
  type: string;
  cover_letter: string;
  status: string;
  created_at: string;
  updated_at: string;
  poster_name?: string;
  poster_email?: string;
  poster_avatar?: string;
  payment?: string;
  deadline?: string;
  location?: string;
}

// Contact types
export interface ContactType {
  id: number;
  user_id: number;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
  
  // For skill contacts
  skill_id?: number;
  skill_name?: string;
  pricing?: string;
  provider_name?: string;
  provider_email?: string;
  
  // For material contacts
  material_id?: number;
  title?: string;
  price?: string;
  seller_name?: string;
  seller_email?: string;
  conditions?: string;
  
  // For received contacts
  contact_name?: string;
  contact_email?: string;
  contact_avatar?: string;
}

// Work types
export interface WorkType {
  id: number;
  job_id?: number;
  skill_id?: number;
  material_id?: number;
  provider_id: number;
  client_id: number;
  status: string;
  start_date: string;
  end_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  
  // Job-related fields
  job_title?: string;
  job_type?: string;
  job_payment?: string;
  job_description?: string;
  
  // Skill-related fields
  skill_name?: string;
  skill_pricing?: string;
  skill_description?: string;
  
  // Material-related fields
  material_title?: string;
  material_price?: string;
  material_description?: string;
  
  // User fields
  provider_name?: string;
  provider_email?: string;
  provider_avatar?: string;
  client_name?: string;
  client_email?: string;
  client_avatar?: string;
}

// Invoice types
export interface InvoiceType {
  id: number;
  user_id: number;
  invoice_number: string;
  client: string;
  title: string;
  amount: string;
  status: string;
  issued_date: string;
  due_date: string;
  created_at: string;
}

// Notification types
export interface NotificationType {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: string;
  reference_id?: number;
  reference_type?: string;
  is_read: boolean;
  created_at: string;
}
