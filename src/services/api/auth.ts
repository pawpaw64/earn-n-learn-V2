
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
  try {
    const response = await axios.post(`${API_URL}/users/register`, userData);
    return response.data;
  } catch (error: any) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Login an existing user
 */
export const loginUser = async (credentials: any): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, credentials);
    
    // Store token and user ID in localStorage for persistent auth
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      
      // Extract and store user ID for convenience
      const userId = getUserIdFromToken(response.data.token);
      if (userId) localStorage.setItem('userId', userId.toString());
    }
    
    return response.data;
  } catch (error: any) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get current logged in user
 */
export const getCurrentUser = async () => {
  try {
    // Set token before making request
    setAuthToken(localStorage.getItem('token'));
    
    const response = await axios.get(`${API_URL}/users/me`);
    return response.data;
  } catch (error: any) {
    console.error("Get current user error:", error.response?.data || error.message);
    
    // If token is invalid, clear it
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      setAuthToken(null);
    }
    
    throw error;
  }
};

/**
 * Log out the current user
 */
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  setAuthToken(null);
};

/**
 * Check if user is logged in
 */
export const isUserLoggedIn = (): boolean => {
  const token = localStorage.getItem('token');
  return !!token;
};

/**
 * Get user ID from JWT token
 */
export function getUserIdFromToken(token: string | null): number | null {
  if (!token) return null;
  
  try {
    // JWT tokens are made of 3 parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    // The middle part contains the payload
    const payload = JSON.parse(atob(parts[1]));
    
    // Most JWT implementations store user ID as 'id', 'sub', or 'userId'
    const userId = payload.id || payload.sub || payload.userId;
    return userId ? Number(userId) : null;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}
