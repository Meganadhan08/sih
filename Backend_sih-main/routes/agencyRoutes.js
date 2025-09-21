// backend/routes/agencyRoutes.js
const express = require("express");
const router = express.Router();
const Agency = require("../models/Agency");
const Batch = require("../models/Batch");

// ----------------------
// Agency Register
// POST /api/agency/register
// ----------------------
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, contactNumber, location } = req.body;

    // Check if already registered
    const existing = await Agency.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Agency already registered" });
    }

    const agency = new Agency({
      name,
      email,
      password, // hashed automatically in model
      contactNumber,
      location
    });

    await agency.save();

    res.status(201).json({
      message: "Agency registered successfully",
      agency: {
        id: agency._id,
        name: agency.name,
        email: agency.email,
        contactNumber: agency.contactNumber,
        location: agency.location
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------
// Agency Login
// POST /api/agency/login
// ----------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const agency = await Agency.findOne({ email });
    if (!agency) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await agency.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      message: "Login successful",
      agency: {
        id: agency._id,
        name: agency.name,
        email: agency.email,
        contactNumber: agency.contactNumber,
        location: agency.location,
        batches: agency.batches
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------
// Assign batch to agency
// POST /api/agency/assign-batch
// ----------------------
router.post("/assign-batch", async (req, res) => {
  try {
    const { agencyId, batchId } = req.body;

    const agency = await Agency.findById(agencyId);
    if (!agency) return res.status(404).json({ message: "Agency not found" });

    const batch = await Batch.findById(batchId);
    if (!batch) return res.status(404).json({ message: "Batch not found" });

    if (!agency.batches.includes(batch._id)) {
      agency.batches.push(batch._id);
      await agency.save();
    }

    batch.status = "Assigned to Agency";
    await batch.save();

    res.status(200).json({ message: "Batch assigned to agency", agency, batch });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------
// Get all batches for an agency
// GET /api/agency/:agencyId/batches
// ----------------------
router.get("/:agencyId/batches", async (req, res) => {
  try {
    const { agencyId } = req.params;
    const agency = await Agency.findById(agencyId).populate("batches");
    if (!agency) return res.status(404).json({ message: "Agency not found" });

    res.status(200).json({ agency: agency.name, batches: agency.batches });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------
// Update batch status
// POST /api/agency/update-batch-status
// ----------------------
router.post("/update-batch-status", async (req, res) => {
  try {
    const { batchId, status, note } = req.body;

    const batch = await Batch.findById(batchId);
    if (!batch) return res.status(404).json({ message: "Batch not found" });

    batch.status = status;

    batch.history.push({
      status,
      note,
      updatedAt: new Date()
    });

    await batch.save();

    res.status(200).json({ message: "Batch status updated successfully", batch });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
