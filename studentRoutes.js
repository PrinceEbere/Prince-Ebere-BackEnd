const express = require('express');
const router = express.Router();
const { applyHousing, viewApplication } = require('../controllers/studentController');

router.post('/apply', applyHousing);
router.get('/application/:email', viewApplication);

module.exports = router;
