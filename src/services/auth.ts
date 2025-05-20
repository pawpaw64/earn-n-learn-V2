// src/api/auth.ts
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

/**
 * Sets the authentication token for API requests
 */
export const setAuthToken = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Auth types
export interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  message: string;
}

/**
 * Register a new user
 */
export const registerUser = async (userData: any): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/users/register`, userData);
  return response.data;
};

/**
 * Login an existing user
 */
export const loginUser = async (credentials: any): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/users/login`, credentials);
  return response.data;
};

/**
 * Get current logged in user
 */
export const getCurrentUser = async () => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.get(`${API_URL}/users/me`);
  return response.data;
};

/**
 * Get user ID from JWT token
 */
export function getUserIdFromToken(token: string | null): number | null {
  if (!token) return null;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));
    
    const userId = payload.id || payload.sub || payload.userId;
    return userId ? Number(userId) : null;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}