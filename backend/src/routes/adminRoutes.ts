import express from "express";
import {
  getAllShipments,
  updateShipmentStatus,
} from "../models/shipmentModel.js";

const router = express.Router();

router.get("/shipments", async (req, res) => {
  try {
    const shipments = await getAllShipments();
    res.json(shipments);
  } catch (error) {
    console.error("Error fetching all shipments:", error);
    res.status(500).json({ error: "Failed to fetch shipments" });
  }
});

router.patch("/shipments/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedShipment = await updateShipmentStatus(id, status);
    res.json(updatedShipment);
  } catch (error) {
    console.error("Error updating shipment status:", error);
    res.status(500).json({ error: "Failed to update shipment status" });
  }
});

export default router;
