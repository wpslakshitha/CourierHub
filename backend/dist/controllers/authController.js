import bcrypt from "bcrypt";
import { generateToken } from "../utils/auth.js";
import * as userModel from "../models/userModel.js";
// Register a new user
export const register = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body;
        // Validate required fields
        if (!name || !email || !password || !address) {
            return res.status(400).json({
                success: false,
                error: "Please provide all required fields",
            });
        }
        // Check if user already exists
        const existingUser = await userModel.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: "Email already in use",
            });
        }
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Create new user
        const newUser = await userModel.createUser({
            name,
            email,
            password: hashedPassword,
            address,
            phone,
            role: "client", // Default role for new users
        });
        // Generate JWT token
        const token = generateToken({
            user_id: newUser.user_id,
            email: newUser.email,
            role: newUser.role,
        });
        // Return success response with user data and token
        res.status(201).json({
            success: true,
            data: {
                user: {
                    user_id: newUser.user_id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                },
                token,
            },
        });
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            success: false,
            error: "Server error",
        });
    }
};
// Login user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Login request received for email:", email);
        // Validate required fields
        if (!email || !password) {
            console.log("Validation failed: Missing email or password");
            return res.status(400).json({
                success: false,
                error: "Please provide email and password",
            });
        }
        // Check if user exists
        const user = await userModel.findUserByEmail(email);
        if (!user) {
            console.log("User not found for email:", email);
            return res.status(401).json({
                success: false,
                error: "Invalid credentials",
            });
        }
        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log("Invalid password for email:", email);
            return res.status(401).json({
                success: false,
                error: "Invalid credentials",
            });
        }
        // Generate JWT token
        const token = generateToken({
            user_id: user.user_id,
            email: user.email,
            role: user.role,
        });
        // Return success response with user data and token
        res.status(200).json({
            success: true,
            data: {
                user: {
                    user_id: user.user_id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            },
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            error: "Server error",
        });
    }
};
// Get current user
export const getCurrentUser = async (req, res) => {
    try {
        if (!req.user || !req.user.user_id) {
            return res.status(401).json({
                success: false,
                error: "Unauthorized",
            });
        }
        // Get user details from database
        const user = await userModel.findUserById(req.user.user_id);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found",
            });
        }
        // Return user data without password
        res.status(200).json({
            success: true,
            data: {
                user: {
                    user_id: user.user_id,
                    name: user.name,
                    email: user.email,
                    address: user.address,
                    phone: user.phone,
                    role: user.role,
                    created_at: user.created_at,
                },
            },
        });
    }
    catch (error) {
        console.error("Get current user error:", error);
        res.status(500).json({
            success: false,
            error: "Server error",
        });
    }
};
