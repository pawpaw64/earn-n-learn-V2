
// src/api/auth.ts
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

/**
 * Sets the authentication token for API requests
 */
export const setAuthToken = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // Extract and store userId from token
    const userId = getUserIdFromToken(token);
    if (userId) {
      localStorage.setItem('userId', userId.toString());
      console.log('Stored userId in localStorage:', userId);
    }
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('userId');
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
  
  // Store user info in localStorage
  if (response.data.user) {
    localStorage.setItem('userId', response.data.user.id.toString());
    localStorage.setItem('userName', response.data.user.name);
    localStorage.setItem('userEmail', response.data.user.email);
    console.log('Registration - Stored userId:', response.data.user.id);
  }
  
  return response.data;
};

/**
 * Login an existing user
 */
export const loginUser = async (credentials: any): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/users/login`, credentials);
  
  // Store user info in localStorage
  if (response.data.user) {
    localStorage.setItem('userId', response.data.user.id.toString());
    localStorage.setItem('userName', response.data.user.name);
    localStorage.setItem('userEmail', response.data.user.email);
    console.log('Login - Stored userId:', response.data.user.id);
  }
  
  return response.data;
};

/**
 * Get current logged in user
 */
export const getCurrentUser = async () => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.get(`${API_URL}/users/me`);
  
  // Ensure userId is stored in localStorage
  if (response.data.id) {
    localStorage.setItem('userId', response.data.id.toString());
    console.log('getCurrentUser - Stored userId:', response.data.id);
  }
  
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

/**
 * Get current user ID from localStorage or token
 */
export const getCurrentUserId = (): number => {
  const storedUserId = localStorage.getItem('userId');
  if (storedUserId) {
    console.log('Retrieved userId from localStorage:', storedUserId);
    return parseInt(storedUserId);
  }
  
  const token = localStorage.getItem('token');
  if (token) {
    const userId = getUserIdFromToken(token);
    if (userId) {
      localStorage.setItem('userId', userId.toString());
      console.log('Retrieved and stored userId from token:', userId);
      return userId;
    }
  }
  
  console.warn('No userId found, defaulting to 0');
  return 0;
};
