const express = require('express');
const router = express.Router();
const recommendationsController = require('../controller/recommendationsController');

// Endpoint untuk mendapatkan Personalized Recommendations
router.get('/', (req, res) => {
  recommendationsController.getRecommendations(req, res);
});

module.exports = router;
