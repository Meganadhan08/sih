const Processor = require('../models/Processor');
const Batch = require('../models/Batch');
const QRCode = require('qrcode');
const Farmer = require('../models/Farmer');
const Agency = require('../models/Agency');
const LabTest = require('../models/LabTest');

exports.createProcessorRecord = async (req, res) => {
  try {
    const { batchId, finalProductBatchId, herbName, partUsed, quantityProcessed,
      dryingMethod, extractionMethod, productName, formulationType, expiryDate, finalLabCheck } = req.body;

    // ✅ Check required fields
    if (!batchId || !herbName || !productName) {
      return res.status(400).json({ error: 'batchId, herbName, and productName are required' });
    }

    // ✅ Make sure batch exists
    const batch = await Batch.findOne({ batchId });
    if (!batch) return res.status(404).json({ error: 'Batch not found' });

    // ✅ Create Processor document
    const processor = new Processor({
      batches: [batch._id],        // link batch object
      finalProductBatchId,
      herbName,
      partUsed,
      quantityProcessed,
      dryingMethod,
      extractionMethod,
      productName,
      formulationType,
      expiryDate,
      finalLabCheck
    });

    // ✅ Save first to get _id
    await processor.save();

    // ✅ Update batch to link processor
    batch.processorId = processor._id;
    await batch.save();

    // ---------------------------
    // Generate Final QR with all info
    // ---------------------------
    const farmer = await Farmer.findById(batch.farmer);
    const agency = batch.agency ? await Agency.findById(batch.agency) : null;
    const labTest = batch.labTestId ? await LabTest.findById(batch.labTestId) : null;

    const finalPayload = {
      batch: {
        batchId: batch.batchId,
        species: batch.species,
        quantity: batch.quantity,
        status: batch.status,
        geoTag: batch.geoTag
      },
      farmer: farmer ? {
        name: farmer.name,
        contactNumber: farmer.contactNumber,
        farmLocation: farmer.farmLocation,
        totalHarvested: farmer.totalHarvested
      } : null,
      agency: agency ? {
        name: agency.name,
        contactNumber: agency.contactNumber,
        location: agency.location
      } : null,
      labTest: labTest ? {
        labName: labTest.labName,
        result: labTest.result,
        failReasons: labTest.failReasons
      } : null,
      processor: {
        finalProductBatchId,
        herbName,
        partUsed,
        quantityProcessed,
        dryingMethod,
        extractionMethod,
        productName,
        formulationType,
        expiryDate,
        finalLabCheck
      }
    };

    // Generate QR code with all info
    // processor.qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(finalPayload, null, 2));
    const url = `https://ai-herb-tracker.onrender.com/batch/${batch.batchId}`;
    const qrCodeDataUrl = await QRCode.toDataURL(url);

    res.status(201).json({ 
      message: 'Processing + Manufacturing data saved with final QR',
      processor,
      finalQR: processor.qrCodeDataUrl
    });

  } catch (err) {
    console.error('Processor creation error:', err);
    res.status(500).json({ error: err.message });
  }
};

// GET records by batchId
exports.getProcessorRecords = async (req, res) => {
  try {
    const processorRecords = await Processor.find({ batches: req.params.batchId });
    res.json(processorRecords);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};