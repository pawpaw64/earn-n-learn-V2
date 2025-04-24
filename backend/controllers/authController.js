// filepath: d:\Codes\projects\GitHub\skill-share-campus-75\backend\controllers\authController.js
import { pool } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    console.log('Registration request:', { ...req.body, password: '[REDACTED]' });
    console.log('Request body:', req.body); // Add this line

    try {
        // Validation
        const { name, email, password, student_id, university, course, mobile } = req.body;
        if (!name || !email || !password || !student_id || !university || !course || !mobile) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check existing user
        const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
        if (users.length > 0) {
            return res.status(409).json({ error: "Email already registered" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const [result] = await pool.query(
            "INSERT INTO users (name, email, password_hash, student_id, university, course, mobile) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [name, email, hashedPassword, student_id, university, course, mobile]
        );[]
        console.log('Database insertion result:', result); // Add this line
        // Generate token
        const token = jwt.sign(
            { id: result.insertId, email: email },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );
        console.log('Generated JWT token:', token); // Add this line
        const responseData = { message: "Registration successful", token };
        console.log('Sending response:', responseData); // Add this line
        res.status(201).json(responseData);
    } catch (error) {
        
        console.error('Registration error:', error);
        res.status(500).json({ error: "Registration failed", details: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Get user
        const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
        if (users.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, users[0].password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate token
        const token = jwt.sign(
            { id: users[0].id },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.json({
            token,
            user: {
                id: users[0].id,
                name: users[0].name,
                email: users[0].email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: "Login failed", details: error.message });
    }
};

export const logout = (req, res) => {
    try {
        // Clear the token (if using cookies or server-side sessions)
        res.clearCookie('token');

        // Send a success response
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Logout failed', details: error.message });
    }
};