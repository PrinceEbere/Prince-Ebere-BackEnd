const express = require('express');
const router = express.Router();
const { getAllApplications, processApplication } = require('../controllers/adminController');

router.get('/applications', getAllApplications);
router.post('/applications/:id', processApplication);

module.exports = router;
