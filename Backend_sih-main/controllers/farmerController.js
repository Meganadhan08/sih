const Farmer = require('../models/Farmer');
const Batch = require('../models/Batch');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { isWithinCultivationZone } = require('../utils/geofence');
const { SPECIES_LIMITS, getCurrentSeason } = require('../utils/limits');

// ----------------------
// Register Farmer
exports.registerFarmer = async (req, res) => {
  try {
    const { name, email, password, location, contact } = req.body;

    if (!name || !email || !password || !location || !contact) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingFarmer = await Farmer.findOne({ email });
    if (existingFarmer) {
      return res.status(400).json({ message: 'Farmer already registered with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const farmer = new Farmer({
      name,
      email,
      password: hashedPassword,
      location,
      contact,
      totalHarvested: 0,
      seasonalHarvest: {}
    });

    await farmer.save();
    res.status(201).json({ message: 'Farmer registered successfully', farmer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ----------------------
// Add Batch
exports.addBatch = async (req, res) => {
  try {
    const { farmerId, species, quantity, latitude, longitude, photos, qualityScore, useAutoGPS } = req.body;

    const farmer = await Farmer.findById(farmerId);
    if (!farmer) return res.status(404).json({ message: 'Farmer not found' });

    let lat = latitude, lng = longitude;
    if (useAutoGPS) { lat = 12.9716; lng = 77.5946; } // fallback GPS

    if (!isWithinCultivationZone(lat, lng)) {
      return res.status(400).json({ message: 'Batch must be within Karnataka Ashwagandha zones' });
    }

    const season = getCurrentSeason();
    const speciesLimit = SPECIES_LIMITS[species];

    if (!farmer.seasonalHarvest) farmer.seasonalHarvest = {};
    if (!farmer.seasonalHarvest[species]) farmer.seasonalHarvest[species] = {};
    const harvestedThisSeason = farmer.seasonalHarvest[species][season] || 0;

    if (harvestedThisSeason + quantity > speciesLimit) {
      return res.status(400).json({ message: `Seasonal harvest limit exceeded for ${species} (${speciesLimit} max)` });
    }

    // ✅ Save batch in Batch collection
    const batch = await Batch.create({
      batchId: `BATCH-${uuidv4().split('-')[0].toUpperCase()}`,
      farmer: farmerId,
      species,
      quantity,
      geoTag: { latitude: lat, longitude: lng },
      photos: photos || [],
      qualityScore: qualityScore || null
    });

    farmer.totalHarvested += quantity;
    farmer.seasonalHarvest[species][season] = harvestedThisSeason + quantity;
    await farmer.save();

    res.status(201).json({ message: 'Batch added successfully', batch });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ----------------------
// Update Farmer Location
exports.addLocation = async (req, res) => {
  try {
    const { farmerId, latitude, longitude, address } = req.body;

    const farmer = await Farmer.findById(farmerId);
    if (!farmer) return res.status(404).json({ message: 'Farmer not found' });

    farmer.location = { latitude, longitude, address };
    await farmer.save();

    res.status(200).json({ message: 'Location updated successfully', location: farmer.location });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
