import express from 'express';
import { login, register, logout } from '../controllers/authController.js'; // Ensure this path is correct



const router = express.Router();

router.post("/register", register); // register user
router.post("/login", login); // login user
router.post("/logout", logout); // logout user

export default router;