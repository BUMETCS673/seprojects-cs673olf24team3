// routes/goalRoutes.js
const express = require('express');
const { createOrUpdateGoal,getGoal } = require('../controllers/goalController');
const router = express.Router();

// Create a new goal
router.get('/', getGoal);
router.post('/', createOrUpdateGoal);

module.exports = router;