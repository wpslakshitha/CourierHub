import { UserProfile } from "../types/index.js";
import query from "../utils/query.js";

export interface User {
  user_id?: number;
  name: string;
  email: string;
  password: string;
  address: string;
  phone?: string;
  role: string;
  created_at?: Date;
  updated_at?: Date;
}

// Find user by email
export const findUserByEmail = async (email: string): Promise<User | null> => {
  console.log("Searching for user with email:", email);
  const result = await query("SELECT * FROM users WHERE email = $1", [email]);
  if (!result.rows[0]) {
    console.log("User not found for email:", email);
    return null;
  }

  console.log("User found for email:", email);
  return {
    user_id: result.rows[0].id,
    name: result.rows[0].name,
    email: result.rows[0].email,
    password: result.rows[0].password,
    address: result.rows[0].address,
    phone: result.rows[0].phone,
    role: result.rows[0].role,
    created_at: result.rows[0].created_at,
    updated_at: result.rows[0].updated_at,
  };
};

// Create new user
export const createUser = async (userData: User): Promise<User> => {
  const { name, email, password, address, phone, role } = userData;

  const result = await query(
    `INSERT INTO users 
     (name, email, password, address, phone, role, created_at, updated_at) 
     VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) 
     RETURNING *`,
    [name, email, password, address, phone || null, role]
  );

  return result.rows[0];
};

// Find user by ID
export const findUserById = async (userId: number): Promise<User | null> => {
  const result = await query("SELECT * FROM users WHERE user_id = $1", [
    userId,
  ]);
  return result.rows.length > 0 ? result.rows[0] : null;
};

// Get user profile by ID
export const getUserProfile = async (
  userId: number
): Promise<UserProfile | null> => {
  console.log("Fetching profile for user ID:", userId);
  const queryText = `
    SELECT 
      id AS user_id,
      first_name,
      last_name,
      email,
      phone,
      address,
      city,
      state,
      postal_code,
      country
    FROM users
    WHERE id = $1
  `;
  const result = await query(queryText, [userId]);

  if (!result.rows[0]) {
    console.log("Profile not found for user ID:", userId);
    return null;
  }

  console.log("Profile found for user ID:", userId);
  return result.rows[0];
};
