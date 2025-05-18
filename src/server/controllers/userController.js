
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
    
    const [skills, portfolio] = await Promise.all([
      UserModel.getUserSkills(req.user.id),
      UserModel.getUserPortfolio(req.user.id)
    ]);
    
    res.json({ user, skills, portfolio });
  } catch (error) {
    console.error('Get user error:', error);
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

// Get user applications
export async function getUserApplications(req, res) {
  console.log('Getting user applications... [userController.js.getUserApplications]');
  try {
    // This is a mock response until the applications table is implemented
    // In a real app, you'd query the applications table
    const mockApplications = [
      {
        id: 1,
        title: "Frontend Developer",
        company: "Tech Solutions Inc",
        status: "Applied",
        dateApplied: "2024-04-15",
        description: "Applied for the frontend developer position focused on React and TypeScript development.",
        type: "Part-time",
      },
      {
        id: 2,
        title: "UI/UX Designer",
        company: "Creative Studios",
        status: "In Review",
        dateApplied: "2024-04-10",
        description: "Applied for the UI/UX designer position for the campus mobile app project.",
        type: "Project-based",
      }
    ];
    
    res.json(mockApplications);
  } catch (error) {
    console.error('Get user applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get user works
export async function getUserWorks(req, res) {
  console.log('Getting user works... [userController.js.getUserWorks]');
  try {
    // This is a mock response until the works table is implemented
    // In a real app, you'd query the works table
    const mockWorks = [
      {
        id: 1,
        title: "Website Development",
        company: "Student Union",
        status: "In Progress",
        startDate: "2024-03-01",
        deadline: "2024-05-01",
        description: "Developing the new student union website using React and Tailwind CSS.",
        type: "Project",
      },
      {
        id: 2,
        title: "Database Tutor",
        company: "Computer Science Department",
        status: "Completed",
        startDate: "2024-02-01",
        endDate: "2024-03-15",
        description: "Provided SQL and database design tutoring to junior students.",
        type: "Part-time",
      }
    ];
    
    res.json(mockWorks);
  } catch (error) {
    console.error('Get user works error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
