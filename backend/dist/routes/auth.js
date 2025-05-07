import express from "express";
import { getCurrentUser, login, register, } from "../controllers/authController.js";
import { authenticateToken } from "../utils/auth.js";
const router = express.Router();
// Register a new user
router.post("/register", register);
// Login user
router.post("/login", login);
// Get current user (protected route)
router.get("/me", authenticateToken, getCurrentUser);
export default router;
