
import axios from 'axios';
import { PostType, CommentType } from '@/types/campus';
import { setAuthToken } from './auth';

const API_URL = 'http://localhost:8080/api';

export const fetchPosts = async (filters?: any): Promise<PostType[]> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.tags) params.append('tags', filters.tags.join(','));
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const response = await axios.get(`${API_URL}/campus/posts?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

export const fetchPostById = async (id: number): Promise<PostType | null> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/campus/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
};

export const createPost = async (postData: any): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  
  const formData = new FormData();
  formData.append('type', postData.type);
  formData.append('title', postData.title);
  formData.append('content', postData.content);
  formData.append('tags', JSON.stringify(postData.tags));
  formData.append('privacy', postData.privacy);
  
  if (postData.attachment) {
    formData.append('attachment', postData.attachment);
  }

  if (postData.pollData) {
    formData.append('pollData', JSON.stringify(postData.pollData));
  }

  const response = await axios.post(`${API_URL}/campus/posts`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const votePoll = async (optionId: number): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.post(`${API_URL}/campus/polls/${optionId}/vote`);
  return response.data;
};

// ... keep existing code (all other functions remain the same)

export const fetchComments = async (postId: number): Promise<CommentType[]> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/campus/posts/${postId}/comments`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
};

export const createComment = async (commentData: any): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.post(`${API_URL}/campus/comments`, commentData);
  return response.data;
};

export const togglePostLike = async (postId: number): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.post(`${API_URL}/campus/posts/${postId}/like`);
  return response.data;
};

export const toggleCommentLike = async (commentId: number): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.post(`${API_URL}/campus/comments/${commentId}/like`);
  return response.data;
};

export const searchPosts = async (query: string, filters?: any): Promise<PostType[]> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const params = new URLSearchParams();
    params.append('q', query);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.tags) params.append('tags', filters.tags.join(','));
    if (filters?.dateRange) params.append('dateRange', filters.dateRange);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const response = await axios.get(`${API_URL}/campus/posts/search?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error searching posts:', error);
    return [];
  }
};
