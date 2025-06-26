
import UserModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for profile image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/profiles/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

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
      stack: error.stack
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
    console.log('Searching for user with email:', email);
    const user = await UserModel.findByEmail(email);
    
    if (!user) {
      console.log('No user found with email:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log('Password comparison failed');
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ 
      token,
      user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar },
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
    
    // Add full URL for avatar if it exists
    if (user.avatar) {
      user.avatar = `http://localhost:8080${user.avatar}`;
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
    
    // Add full URL for avatar if it exists
    if (user.avatar) {
      user.avatar = `http://localhost:8080${user.avatar}`;
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

// Update user profile
export async function updateProfile(req, res) {
  console.log('Updating user profile... [userController.js.updateProfile]');
  try {
    const updateData = { ...req.body };
    
    // If new avatar is uploaded, update the avatar URL
    if (req.file) {
      updateData.avatar = `/uploads/profiles/${req.file.filename}`;
      
      // Get current user to delete old avatar
      const currentUser = await UserModel.getById(req.user.id);
      if (currentUser && currentUser.avatar && currentUser.avatar.startsWith('/uploads/')) {
        const oldImagePath = path.join(process.cwd(), 'src/server', currentUser.avatar);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }
    const updated = await UserModel.updateProfile(req.user.id, updateData);
    
    // Return the full avatar URL
    let avatarUrl = null;
    if (updateData.avatar) {
      avatarUrl = `http://localhost:8080${updateData.avatar}`;
    }
    
    res.json({ 
      message: updated ? 'Profile updated successfully' : 'Profile update failed',
      success: updated,
      avatar: avatarUrl
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
export async function uploadAvatar(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }
    
    const imageUrl = `/uploads/profiles/${req.file.filename}`;
    
    // Update user's avatar in database
    const updated = await UserModel.updateProfile(req.user.id, { avatar: imageUrl });
    
    if (updated) {
      res.json({ 
        imageUrl: `http://localhost:8080${imageUrl}`, 
        message: 'Avatar uploaded successfully' 
      });
    } else {
      res.status(500).json({ message: 'Failed to update avatar in database' });
    }
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({ message: 'Avatar upload failed' });
  }
}
// Add user skill
export async function addUserSkill(req, res) {
  console.log('Adding user skill... [userController.js.addUserSkill]');
  try {
    const { name, description, acquiredFrom } = req.body;
    const userId = req.user.id;

    if (!name) {
      return res.status(400).json({ message: 'Skill name is required' });
    }

    const skillId = await UserModel.addUserSkill(userId, { name, description, acquiredFrom });
    
    res.status(201).json({ 
      message: 'Skill added successfully',
      skillId,
      success: true
    });
  } catch (error) {
    console.error('Add skill error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Remove user skill
export async function removeUserSkill(req, res) {
  console.log('Removing user skill... [userController.js.removeUserSkill]');
  try {
    const { skillId } = req.params;
    const userId = req.user.id;

    const removed = await UserModel.removeUserSkill(userId, skillId);
    
    if (removed) {
      res.json({ message: 'Skill removed successfully', success: true });
    } else {
      res.status(404).json({ message: 'Skill not found' });
    }
  } catch (error) {
    console.error('Remove skill error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Add portfolio item
export async function addPortfolioItem(req, res) {
  console.log('Adding portfolio item... [userController.js.addPortfolioItem]');
  try {
    const { title, description, url, type } = req.body;
    const userId = req.user.id;

    if (!title || !url) {
      return res.status(400).json({ message: 'Title and URL are required' });
    }

    const itemId = await UserModel.addPortfolioItem(userId, { title, description, url, type });
    
    res.status(201).json({ 
      message: 'Portfolio item added successfully',
      itemId,
      success: true
    });
  } catch (error) {
    console.error('Add portfolio item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Remove portfolio item
export async function removePortfolioItem(req, res) {
  console.log('Removing portfolio item... [userController.js.removePortfolioItem]');
  try {
    const { itemId } = req.params;
    const userId = req.user.id;

    const removed = await UserModel.removePortfolioItem(userId, itemId);
    
    if (removed) {
      res.json({ message: 'Portfolio item removed successfully', success: true });
    } else {
      res.status(404).json({ message: 'Portfolio item not found' });
    }
  } catch (error) {
    console.error('Remove portfolio item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Add user website
export async function addUserWebsite(req, res) {
  console.log('Adding user website... [userController.js.addUserWebsite]');
  try {
    const { title, url, icon } = req.body;
    const userId = req.user.id;

    if (!title || !url) {
      return res.status(400).json({ message: 'Title and URL are required' });
    }

    const websiteId = await UserModel.addUserWebsite(userId, { title, url, icon });
    
    res.status(201).json({ 
      message: 'Website added successfully',
      websiteId,
      success: true
    });
  } catch (error) {
    console.error('Add website error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Remove user website
export async function removeUserWebsite(req, res) {
  console.log('Removing user website... [userController.js.removeUserWebsite]');
  try {
    const { websiteId } = req.params;
    const userId = req.user.id;

    const removed = await UserModel.removeUserWebsite(userId, websiteId);
    
    if (removed) {
      res.json({ message: 'Website removed successfully', success: true });
    } else {
      res.status(404).json({ message: 'Website not found' });
    }
  } catch (error) {
    console.error('Remove website error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}


// Export multer middleware
export const uploadAvatarMiddleware = upload.single('image');
