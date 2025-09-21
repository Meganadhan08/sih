// backend/routes/labRoutes.js
const express = require("express");
const router = express.Router();
const LabTest = require("../models/LabTest");
const Batch = require("../models/Batch");
const { generateQRCode } = require("../utils/qrcode");

// ----------------------
// POST /api/lab/test
// Add a lab test for a batch
// ----------------------
router.post("/test", async (req, res) => {
  try {
    const { batchId, labName, analystId, parameters, certificateUrl } = req.body;

    if (!labName) return res.status(400).json({ error: "labName is required" });
    if (!batchId) return res.status(400).json({ error: "batchId is required" });

    // Find batch
    const batch = await Batch.findById(batchId);
    if (!batch) return res.status(404).json({ error: "Batch not found" });

    // Evaluate fail reasons
    const failReasons = [];
    let result = "Pass";

    if (parameters) {
      if (parameters.moisture && parameters.moisture > 12) failReasons.push("MoistureHigh");

      if (parameters.pesticide_ppm) {
        for (const [pest, value] of Object.entries(parameters.pesticide_ppm)) {
          if (value > 0.01) failReasons.push(`${pest}AboveThreshold`);
        }
      }

      if (parameters.dnaBarcode && parameters.dnaBarcode.matched === false) {
        failReasons.push("DNABarcodeMismatch");
      }
    }

    if (failReasons.length > 0) result = "Fail";

    // Create lab test
    const labTest = new LabTest({
      batchId,
      labName,
      analystId,
      parameters,
      result,
      failReasons,
      certificateUrl
    });

    // Generate QR code (base64)
    const qrFile = await generateQRCode(labTest);
    labTest.qrCode = qrFile;

    await labTest.save();

    // Update batch status
    batch.status = result === "Pass" ? "Approved" : "Rejected";
    batch.history.push({ step: "Lab Tested", date: new Date(), by: labName, remarks: result });
    await batch.save();

    res.status(201).json({ labTest, qrFile });

  } catch (err) {
    console.error("Lab Test Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ----------------------
// GET /api/lab/test/:id/qrcode
// Get QR code for a lab test
// ----------------------
router.get("/test/:id/qrcode", async (req, res) => {
  try {
    const labTest = await LabTest.findById(req.params.id);
    if (!labTest) return res.status(404).json({ error: "LabTest not found" });
    if (!labTest.qrCode) return res.status(404).json({ error: "QR code not generated" });

    res.json({ qrCode: labTest.qrCode });
  } catch (err) {
    console.error("QR Fetch Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
