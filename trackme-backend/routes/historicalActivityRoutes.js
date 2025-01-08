const express = require('express');
const router = express.Router();
const historicalActivityController = require('../controller/historicalActivityController');

// Endpoint untuk mendapatkan Historical Activity
router.get('/', historicalActivityController.getHistoricalActivities);

module.exports = router;
