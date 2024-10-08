// routes/goalRoutes.js
const express = require('express');
const { createGoal } = require('../controllers/goalController');
const router = express.Router();

// Create a new goal
router.post('/create-goal', createGoal);

module.exports = router;