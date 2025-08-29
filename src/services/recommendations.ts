import axios from 'axios';
import { setAuthToken } from './auth';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Recommendation {
  id: number;
  matchPercentage: number;
  type: 'job' | 'skill' | 'material';
  
  // Job fields
  title?: string;
  description?: string;
  payment?: string;
  poster?: string;
  posterEmail?: string;
  posterAvatar?: string;
  
  // Skill fields
  name?: string;
  skill?: string;
  skill_name?: string;
  pricing?: string;
  
  // Material fields
  material?: string;
  price?: string;
  condition?: string;
  conditions?: string;
  availability?: string;
  imageUrl?: string;
}

export interface RecommendationResponse {
  jobs: Recommendation[];
  skills: Recommendation[];
  materials: Recommendation[];
}

export const recommendationService = {
  // Get all recommendations
  getAllRecommendations: async (): Promise<RecommendationResponse> => {
    const response = await api.get('/recommendations/all');
    return response.data;
  },

  // Get job recommendations
  getJobRecommendations: async (): Promise<Recommendation[]> => {
    const response = await api.get('/recommendations/jobs');
    return response.data;
  },

  // Get skill recommendations
  getSkillRecommendations: async (): Promise<Recommendation[]> => {
    const response = await api.get('/recommendations/skills');
    return response.data;
  },

  // Get material recommendations
  getMaterialRecommendations: async (): Promise<Recommendation[]> => {
    const response = await api.get('/recommendations/materials');
    return response.data;
  },
};