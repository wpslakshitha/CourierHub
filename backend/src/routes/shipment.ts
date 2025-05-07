import express from "express";
import {
  createShipment,
  getShipmentByTracking,
  getShipmentsByUser,
} from "../models/shipmentModel.js";
import { ShipmentDTO } from "../types/index.js";

const router = express.Router();

// POST /api/shipments
router.post("/", async (req, res) => {
  try {
    const shipmentData: ShipmentDTO = req.body;

    const newShipment = await createShipment(shipmentData);

    res.status(201).json(newShipment);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to create shipment" });
  }
});

// GET shipments by user ID
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const shipments = await getShipmentsByUser(userId);

    res.json(shipments);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to get shipments" });
  }
});

router.get("/track/:trackingNumber", async (req, res) => {
  try {
    const trackingNumber = req.params.trackingNumber;
    const shipment = await getShipmentByTracking(trackingNumber);

    if (!shipment) {
      return res.status(404).json({ error: "Shipment not found" });
    }

    res.json(shipment);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to track shipment" });
  }
});

export default router;
