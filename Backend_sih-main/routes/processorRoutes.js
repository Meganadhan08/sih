// backend/routes/processorRoutes.js
const express = require('express');
const router = express.Router();
const processorController = require('../controllers/processorController');

// 👉 POST - create record
router.post('/', processorController.createProcessorRecord);

// 👉 GET - fetch records by batchId
router.get('/:batchId', processorController.getProcessorRecords);

module.exports = router;
