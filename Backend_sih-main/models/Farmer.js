// backend/models/Farmer.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const farmerSchema = new mongoose.Schema({
    farmerId: { type: String, unique: true, required: true, default: () => uuidv4() },
    name: String,
    contactNumber: String,
    password: String,
    crops: [String],
    farmLocation: { latitude: Number, longitude: Number },
    totalHarvested: { type: Number, default: 0 },
    seasonalHarvest: { 
        type: Map,
        of: Map,
        default: {}
    }
});

module.exports = mongoose.model('Farmer', farmerSchema);
