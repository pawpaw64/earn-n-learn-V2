
import UserModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Register
export async function register(req, res) {
  try {
    console.log('Registering new user... [userController.js.register]');
    const { name, email, password, studentId, university, course, mobile } = req.body;

    // Validate input
    if (!name || !email || !password || !studentId || !university) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields',
        required: ['name', 'email', 'password', 'studentId', 'university']
      });
    }

    // Check for existing user
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create new user
    const userId = await UserModel.create({
      name, email, password, studentId, university, course, mobile
    });

    if (!userId) {
      throw new Error('User creation returned no ID');
    }

    // Generate token
    const token = jwt.sign(
      { id: userId, email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      token,
      user: { id: userId, name, email },
      message: 'Registration successful'
    });

  } catch (error) {
    console.error('Registration failed:', {
      error: error.message,
      body: req.body,
      stack: error.stack // Always log stack for debugging
    });
    
    return res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Login
export async function login(req, res) {
  console.log('Logging in user... [userController.js.login]');
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    // 1. First debug point - check if we're finding the user
    console.log('Searching for user with email:', email);
    const user = await UserModel.findByEmail(email);
    
    if (!user) {
      console.log('No user found with email:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 2. Second debug point - check the passwords
    console.log('Comparing passwords:');
    console.log('Input password:', password);
    console.log('Stored hash:', user.password);
    
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log('Password comparison failed');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 3. If we get here, login is successful
    console.log('Login successful for user:', user.email);
    
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ 
      token,
      user: { id: user.id, name: user.name, email: user.email },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get current user
export async function getMe(req, res) {
  console.log('Getting current user... [userController.js.getMe]');
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const [skills, portfolio, websites] = await Promise.all([
      UserModel.getUserSkills(req.user.id),
      UserModel.getUserPortfolio(req.user.id),
      UserModel.getUserWebsites(req.user.id)
    ]);
    
    res.json({ 
      user, 
      skills: skills || [], 
      portfolio: portfolio || [],
      websites: websites || [] 
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get user by ID (for viewing other profiles)
export async function getUserById(req, res) {
  console.log('Getting user by ID... [userController.js.getUserById]');
  try {
    const userId = req.params.id;
    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const [skills, portfolio, websites] = await Promise.all([
      UserModel.getUserSkills(userId),
      UserModel.getUserPortfolio(userId),
      UserModel.getUserWebsites(userId)
    ]);
    
    res.json({ 
      user, 
      skills: skills || [], 
      portfolio: portfolio || [],
      websites: websites || [] 
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get user work history (jobs, skills, materials posted)
export async function getUserWorkHistory(req, res) {
  console.log('Getting user work history... [userController.js.getUserWorkHistory]');
  try {
    const userId = req.params.id;
    
    // Verify user exists
    const userExists = await UserModel.userExists(userId);
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get user's posted jobs, skills and materials
    const [jobs, skills, materials] = await Promise.all([
      UserModel.getUserPostedJobs(userId),
      UserModel.getUserPostedSkills(userId),
      UserModel.getUserPostedMaterials(userId)
    ]);
    
    res.json({ 
      jobs: jobs || [], 
      skills: skills || [], 
      materials: materials || [] 
    });
  } catch (error) {
    console.error('Get user work history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get detailed user information including ratings and reviews
export async function getUserDetails(req, res) {
  console.log('Getting user details... [userController.js.getUserDetails]');
  try {
    const userId = req.params.id;
    
    // Get user profile
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get user ratings and reviews
    const [ratings, completedJobs, verifications] = await Promise.all([
      UserModel.getUserRatings(userId),
      UserModel.getUserCompletedJobs(userId),
      UserModel.getUserVerifications(userId)
    ]);
    
    // Calculate average rating
    let averageRating = 0;
    if (ratings && ratings.length > 0) {
      const sum = ratings.reduce((total, rating) => total + rating.rating, 0);
      averageRating = sum / ratings.length;
    }
    
    res.json({ 
      user,
      ratings: {
        average: averageRating.toFixed(1),
        count: ratings.length,
        detail: ratings || []
      },
      completedJobs: completedJobs || [],
      verifications: verifications || []
    });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Update user profile
export async function updateProfile(req, res) {
  console.log('Updating user profile... [userController.js.updateProfile]');
  try {
    const updated = await UserModel.updateProfile(req.user.id, req.body);
    res.json({ 
      message: updated ? 'Profile updated successfully' : 'Profile update failed',
      success: updated
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
