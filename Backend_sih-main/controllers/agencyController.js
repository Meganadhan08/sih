// backend/controllers/agencyController.js
const Agency = require("../models/Agency");
const Batch = require("../models/Batch");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

// ----------------------
// Agency Login
// ----------------------
exports.loginAgency = async (req, res) => {
  try {
    const { email, password } = req.body;

    const agency = await Agency.findOne({ email });
    if (!agency) return res.status(404).json({ message: "Agency not found" });

    const isMatch = await agency.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    res.status(200).json({
      message: "Login successful",
      agency: {
        _id: agency._id,
        name: agency.name,
        email: agency.email,
        contactNumber: agency.contactNumber,
        location: agency.location,
        batches: agency.batches
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ----------------------
// Assign batch to agency
// ----------------------
exports.assignBatchToAgency = async (req, res) => {
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
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ----------------------
// List all batches for an agency
// ----------------------
exports.getAgencyBatches = async (req, res) => {
  try {
    const { agencyId } = req.params;
    const agency = await Agency.findById(agencyId).populate("batches");
    if (!agency) return res.status(404).json({ message: "Agency not found" });

    res.status(200).json({ agency: agency.name, batches: agency.batches });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
// ----------------------
// Update Batch Status (Agency)
// ----------------------
exports.updateBatchStatus = async (req, res) => {
  try {
    const { batchId, status, note } = req.body;

    const batch = await Batch.findById(batchId);
    if (!batch) return res.status(404).json({ message: "Batch not found" });

    // Update batch status
    batch.status = status;

    // Add to history
    batch.history.push({
      status,
      note,
      updatedAt: new Date()
    });

    await batch.save();

    res.status(200).json({
      message: "Batch status updated successfully",
      batch
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
