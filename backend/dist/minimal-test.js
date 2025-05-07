// src/minimal-test.ts
import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
// Basic route to verify server works
app.get("/", (req, res) => {
    res.send("Minimal test server is running");
});
// Log all environment variables (without passwords)
app.get("/env", (req, res) => {
    const safeEnv = {
        PG_USER: process.env.PG_USER,
        PG_HOST: process.env.PG_HOST,
        PG_PORT: process.env.PG_PORT,
        PG_DATABASE: process.env.PG_DATABASE,
        PORT: process.env.PORT,
        NODE_ENV: process.env.NODE_ENV,
    };
    res.json({
        environment: safeEnv,
        message: "Environment variables loaded successfully",
    });
});
// Start the server
app.listen(PORT, () => {
    console.log(`Minimal test server running on port ${PORT}`);
    console.log(`Test the server by visiting: http://localhost:${PORT}`);
    console.log(`Check environment variables at: http://localhost:${PORT}/env`);
});
console.log("Server startup script executed");
