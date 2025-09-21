// backend/routes/farmerRoutes.js
const express = require("express");
const router = express.Router();
const { registerFarmer, addBatch, addLocation } = require("../controllers/farmerController");

// Register farmer
router.post("/register", registerFarmer);

// Add batch
router.post("/add-batch", addBatch);

// Update farm location
router.post("/add-location", addLocation);

module.exports = router;
