// routes/goalRoutes.js
const express = require('express');
const { createGoal, updateGoal } = require('../controllers/goalController');
const router = express.Router();

// Create a new goal
router.get('/create-goal', createGoal);
router.post('/create-goal', updateGoal);

module.exports = router;