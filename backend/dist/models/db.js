import dotenv from "dotenv";
import pg from "pg";
// Load environment variables first
dotenv.config();
// Use consistent environment variable names
const config = {
    host: process.env.PG_HOST || "localhost",
    user: process.env.PG_USER || "projectuser", // Changed default from "postgres" to "projectuser"
    password: process.env.PG_PASSWORD || "user123", // Changed default from "courier123" to "user123"
    database: process.env.PG_DATABASE || "pern_project", // Changed default from "courier_db" to "pern_project"
    port: parseInt(process.env.PG_PORT || "5432"),
};
console.log("Database connection config:", config);
const { Pool } = pg;
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
// Test the connection
pool
    .query("SELECT NOW()")
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.error("Database connection error:", err));
export const query = (text, params) => pool.query(text, params);
export default pool;
