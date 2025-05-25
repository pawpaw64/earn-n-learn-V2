
import axios from 'axios';
import { setAuthToken } from './auth';

const API_URL = 'http://localhost:8080/api';

export const uploadImage = async (imageFile: File, type: 'profile' | 'material'): Promise<string> => {
  setAuthToken(localStorage.getItem('token'));
  
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('type', type);
  
  try {
    const response = await axios.post(`${API_URL}/upload/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data.imageUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
};
