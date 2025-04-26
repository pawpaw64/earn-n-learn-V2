
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

// Public routes
router.get('/ping', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.get('/me', auth, userController.getMe);
router.put('/profile', auth, userController.updateProfile);

module.exports = router;
