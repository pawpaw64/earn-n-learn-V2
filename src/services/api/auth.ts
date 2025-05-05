
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

/**
 * Sets the authentication token for API requests
 * @param token - JWT token to include in Authorization header
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

// User registration data type
export interface RegistrationData {
  name: string;
  email: string;
  password: string;
  [key: string]: any;
}

// User login data type
export interface LoginData {
  email: string;
  password: string;
}

/**
 * Register a new user
 * @param userData - User registration data
 * @returns Promise with auth response including token and user info
 */
export const registerUser = async (userData: RegistrationData): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/users/register`, userData);
  return response.data;
};

/**
 * Login an existing user
 * @param credentials - Login credentials
 * @returns Promise with auth response including token and user info
 */
export const loginUser = async (credentials: LoginData): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/users/login`, credentials);
  return response.data;
};

/**
 * Get current logged in user
 * @returns Promise with user data
 */
export const getCurrentUser = async () => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.get(`${API_URL}/users/me`);
  return response.data;
};

/**
 * Get user ID from JWT token
 * @param token - JWT token
 * @returns User ID or null if token is invalid
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
