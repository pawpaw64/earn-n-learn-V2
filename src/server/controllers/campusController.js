
import CampusModel from '../models/campusModel.js';
import multer from 'multer';
import path from 'path';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/campus/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `campus-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Create a new post
export const createPost = async (req, res) => {
  try {
    const { type, title, content, tags, privacy } = req.body;
    
    const postData = {
      user_id: req.user.id,
      type,
      title,
      content,
      tags: tags ? JSON.parse(tags) : [],
      privacy: privacy || 'public',
      attachment_url: req.file ? `/uploads/campus/${req.file.filename}` : null,
      attachment_type: req.file ? req.file.mimetype : null
    };
    
    const postId = await CampusModel.createPost(postData);
    
    res.status(201).json({
      id: postId,
      message: 'Post created successfully'
    });
  } catch (error) {
    console.error('Error in createPost controller:', error);
    res.status(500).json({ message: 'Failed to create post' });
  }
};

// Get posts
export const getPosts = async (req, res) => {
  try {
    const { type, tags, sortBy, limit, offset } = req.query;
    
    const filters = {
      type,
      tags: tags ? tags.split(',') : null,
      sortBy: sortBy || 'recent',
      limit: parseInt(limit) || 20,
      offset: parseInt(offset) || 0,
      userId: req.user.id
    };
    
    const posts = await CampusModel.getPosts(filters);
    res.json(posts);
  } catch (error) {
    console.error('Error in getPosts controller:', error);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
};

// Get post by ID
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await CampusModel.getPostById(id, req.user.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json(post);
  } catch (error) {
    console.error('Error in getPostById controller:', error);
    res.status(500).json({ message: 'Failed to fetch post' });
  }
};

// Create a comment
export const createComment = async (req, res) => {
  try {
    const { post_id, parent_id, content } = req.body;
    
    const commentData = {
      post_id,
      user_id: req.user.id,
      parent_id: parent_id || null,
      content
    };
    
    const commentId = await CampusModel.createComment(commentData);
    
    res.status(201).json({
      id: commentId,
      message: 'Comment created successfully'
    });
  } catch (error) {
    console.error('Error in createComment controller:', error);
    res.status(500).json({ message: 'Failed to create comment' });
  }
};

// Get comments for a post
export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await CampusModel.getCommentsByPostId(postId, req.user.id);
    
    res.json(comments);
  } catch (error) {
    console.error('Error in getComments controller:', error);
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
};

// Toggle post like
export const togglePostLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const isLiked = await CampusModel.togglePostLike(postId, req.user.id);
    
    res.json({
      isLiked,
      message: isLiked ? 'Post liked' : 'Post unliked'
    });
  } catch (error) {
    console.error('Error in togglePostLike controller:', error);
    res.status(500).json({ message: 'Failed to toggle like' });
  }
};

// Toggle comment like
export const toggleCommentLike = async (req, res) => {
  try {
    const { commentId } = req.params;
    const isLiked = await CampusModel.toggleCommentLike(commentId, req.user.id);
    
    res.json({
      isLiked,
      message: isLiked ? 'Comment liked' : 'Comment unliked'
    });
  } catch (error) {
    console.error('Error in toggleCommentLike controller:', error);
    res.status(500).json({ message: 'Failed to toggle like' });
  }
};

// Search posts
export const searchPosts = async (req, res) => {
  try {
    const { q, type, tags, dateRange, sortBy, limit, offset } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const filters = {
      type,
      tags: tags ? tags.split(',') : null,
      dateRange,
      sortBy: sortBy || 'relevance',
      limit: parseInt(limit) || 20,
      offset: parseInt(offset) || 0,
      userId: req.user.id
    };
    
    const posts = await CampusModel.searchPosts(q, filters);
    res.json(posts);
  } catch (error) {
    console.error('Error in searchPosts controller:', error);
    res.status(500).json({ message: 'Failed to search posts' });
  }
};

export { upload };
