import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { TokenPayload } from "../types/index.js";

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Compare password with hashed password
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

// Generate JWT token
export const generateToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_SECRET || "your-secret-key";
  return jwt.sign(payload, secret, { expiresIn: "24h" });
};

// Verify token
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const secret = process.env.JWT_SECRET || "your-secret-key";
    return jwt.verify(token, secret) as TokenPayload;
  } catch (error) {
    return null;
  }
};

// Auth middleware
export const authenticateToken = (
  req: Request & { user?: TokenPayload },
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized: No token provided",
    });
  }

  const user = verifyToken(token);
  if (!user) {
    return res.status(403).json({
      success: false,
      error: "Forbidden: Invalid token",
    });
  }

  req.user = user;
  next();
};

// Admin authorization middleware
export const authorizeAdmin = (
  req: Request & { user?: TokenPayload },
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized: No token provided",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      error: "Forbidden: Admin privileges required",
    });
  }

  next();
};
