// routes/dailyEntryRoutes.js
const express = require('express');
const { enterDailyData, viewDailyData, deleteEntry, lastSevenDays } = require('../controllers/dailyEntryController');
const router = express.Router();

// Enter daily data
router.post('/enter-daily-data', enterDailyData);
router.get('/view-daily-data', viewDailyData);
router.delete('/delete-entry', deleteEntry)
router.post('/last-seven-days', lastSevenDays)

module.exports = router;