const express = require('express');
const customerController = require('../controller/customerControl');
const router = express.Router();
router.get('/profile',customerController.getCustomerProfile);

module.exports = router;
