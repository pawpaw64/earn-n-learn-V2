
// Job types
export interface JobType {
  id: number;
  user_id?: number;
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

export interface Project {
  id: number;
  title: string;
  description?: string;
  provider_id: number;
  client_id: number;
  source_type: 'job' | 'skill' | 'material';
  source_id: number;
  project_type: 'fixed' | 'hourly';
  total_amount?: number;
  hourly_rate?: number;
  current_phase: number;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  start_date: string;
  expected_end_date?: string;
  actual_end_date?: string;
  created_at: string;
  updated_at: string;
  provider_name?: string;
  client_name?: string;
  milestones?: ProjectMilestone[];
}

export interface ProjectMilestone {
  id: number;
  project_id: number;
  phase_number: number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'approved';
  due_date?: string;
  completion_date?: string;
  notes?: string;
}

export interface ProjectUpdate {
  id: number;
  project_id: number;
  milestone_id?: number;
  user_id: number;
  update_type: 'status_change' | 'progress_update' | 'milestone_complete' | 'note';
  message?: string;
  old_status?: string;
  new_status?: string;
  created_at: string;
  user_name?: string;
}

export interface WorkType {
  id: number;
  title: string;
  company: string;
  type: string;
  status: string;
  description: string;
  startDate: string;
  endDate: string | null;
  payment: string;
}

