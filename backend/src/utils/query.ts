import { Pool, QueryResult } from "pg";
import dotenv from "dotenv";

// Load environment variables first
dotenv.config();

const config = {
  host: process.env.PG_HOST || "localhost",
  user: process.env.PG_USER || "projectuser",
  password: process.env.PG_PASSWORD || "123",
  database: process.env.PG_DATABASE || "pern",
  port: parseInt(process.env.PG_PORT || "5432"),
};

// Create connection pool using individual environment variables
const pool = new Pool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
  port: config.port,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test database connection on startup
pool
  .query("SELECT NOW()")
  .then((res) => {
    console.log("Database connected successfully:", res.rows[0]);
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

/**
 * Execute a SQL query with parameters
 * @param text SQL query
 * @param params Query parameters
 * @returns Query result
 */
const query = async (text: string, params?: any[]): Promise<QueryResult> => {
  try {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;

    console.log("Executed query", {
      text,
      duration,
      rows: res.rowCount,
    });

    return res;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
};

export default query;
