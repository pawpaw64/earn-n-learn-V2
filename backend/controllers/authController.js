
import { pool } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    console.log('Registration request:', { ...req.body, password: '[REDACTED]' });

    try {
        // Validation
        const { name, email, password, student_id, university, course, mobile } = req.body;
        if (!name || !email || !password || !student_id || !university || !course || !mobile) {
            return res.status(400).json({ 
                success: false, 
                message: "All fields are required" 
            });
        }

        // Check existing user
        const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
        if (users.length > 0) {
            return res.status(409).json({ 
                success: false, 
                message: "Email already registered" 
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const [result] = await pool.query(
            "INSERT INTO users (name, email, password_hash, student_id, university, course, mobile) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [name, email, hashedPassword, student_id, university, course, mobile]
        );

        // Generate token
        const token = jwt.sign(
            { id: result.insertId, email: email },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.status(201).json({
            success: true,
            message: "Registration successful",
            token,
            name
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false, 
            message: "Registration failed", 
            details: error.message 
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Get user
        const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
        if (users.length === 0) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, users[0].password_hash);
        if (!validPassword) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }

        // Generate token
        const token = jwt.sign(
            { id: users[0].id },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.json({
            success: true,
            token,
            name: users[0].name,
            user: {
                id: users[0].id,
                name: users[0].name,
                email: users[0].email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: "Login failed", 
            details: error.message 
        });
    }
};

export const logout = (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ 
            success: true, 
            message: 'Logout successful' 
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Logout failed', 
            details: error.message 
        });
    }
};
