import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// Routes will be imported here
import authRoutes from "./routes/auth.js";
import shipmentRoutes from "./routes/shipment.js"; // or .ts
import adminRoutes from "./routes/adminRoutes.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/shipments", shipmentRoutes);
app.use("/api/admin", adminRoutes);
app.get("/", (req, res) => {
    res.send("Courier Service API is running");
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
