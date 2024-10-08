// controllers/goalController.js
const Goal = require('../models/Goal');
const jwt = require('jsonwebtoken');

// Create a new goal
exports.createGoal = async (req, res) => {
  try {
    const { type, targetValue } = req.body;

    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header is missing' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token is missing' });
    }

    // Verify and decode the token
    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) {
      return res.status(500).json({ message: 'Secret key is missing in the environment variables' });
    }

    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.userId;

    // Goal creation logic
    let lastGoal = await Goal.find().sort({ goalId: -1 }).limit(1);
    let newGoalId = lastGoal.length > 0 ? lastGoal[0].goalId + 1 : 1;

    let unit;
    switch (type) {
      case 'sleep': unit = 'hours'; break;
      case 'weight': unit = 'lbs'; break;
      case 'steps': unit = 'steps'; break;
      case 'water': unit = 'glasses'; break;
      case 'exercise': unit = 'minutes'; break;
      default: unit = 'unknown';
    }

    const newGoal = new Goal({ goalId: newGoalId, type, targetValue, unit, userId });
    await newGoal.save();

    res.status(201).json({ message: 'New goal created successfully', goalId: newGoalId });
  } catch (error) {
    console.error("Error creating goal:", error); // Log the actual error
    res.status(500).json({ message: 'Failed to create goal' });
  }
};