const LabTest = require('../models/LabTest');
const Batch = require('../models/Batch');
const { evaluateLabTest } = require('../utils/validator');
const blockchain = require('../blockchain/adapter-eth'); // or adapter-fabric
const QR = require('../utils/qrcode');

async function addLabTest(req, res) {
  try {
    const payload = req.body;
    const batch = await Batch.findById(payload.batchId);
    if (!batch) return res.status(404).json({ error: 'Batch not found' });

    // ✅ Step 1: Evaluate test
    const evaluation = evaluateLabTest(payload.parameters);

    // ✅ Step 2: Create LabTest doc
    const labTestDoc = new LabTest({
      batchId: payload.batchId,
      labName: payload.labName,
      analystId: payload.analystId,
      parameters: payload.parameters,
      result: evaluation.result,
      failReasons: evaluation.failReasons,
      certificateUrl: payload.certificateUrl
    });

    await labTestDoc.save();

    // ✅ Step 3: Update Batch with lab test info
    batch.status = (evaluation.result === 'Pass') ? 'APPROVED' : 'REJECTED';
    batch.labTestId = labTestDoc._id; // 🔗 link LabTest to Batch
    batch.history = batch.history || [];
    batch.history.push({
      step: 'Lab Test',
      date: new Date(),
      by: payload.labName,
      remarks: evaluation.result
    });
    await batch.save();

    // ✅ Step 4: Push minimal metadata to blockchain
    const txRef = await blockchain.recordLabTest({
      batchCode: batch.batchCode || batch.batchId, // use whichever field you maintain
      labTestId: labTestDoc._id.toString(),
      result: evaluation.result,
      testDate: labTestDoc.testDate,
    });

    labTestDoc.txRef = txRef;
    await labTestDoc.save();

    // ✅ Step 5: Generate QR payload (optional, for lab record)
    const qrData = {
      batchCode: batch.batchCode || batch.batchId,
      labTestId: labTestDoc._id.toString(),
      txRef
    };
    const qrImageDataUrl = await QR.generateDataURL(JSON.stringify(qrData));

    return res.status(201).json({
      message: 'Lab test recorded',
      labTest: labTestDoc,
      qr: qrImageDataUrl
    });

  } catch (err) {
    console.error('addLabTest error:', err);
    return res.status(500).json({ error: err.message });
  }
}

async function getLabTestsByBatch(req, res) {
  try {
    const tests = await LabTest.find({ batchId: req.params.batchId });
    res.json(tests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { addLabTest, getLabTestsByBatch };
