// controllers/goalController.js
const Goal = require('../models/Goal');
const jwt = require('jsonwebtoken');

// Create a new goal
exports.createGoal = async (req, res) => {
  try {
    

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
    let userGoal = await Goal.findOne({ userId });

    if (!userGoal) {
      userGoal = new Goal({ userId });
      await userGoal.save();
    }

    res.json(userGoal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateGoal = async (req, res) => {
  try {
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
    const decoded = jwt.verify(token, secretKey);

    // Extract userId from the decoded token
    const userId = decoded.userId;

    const { sleepHours, weightLbs, stepsCounts, waterIntakeGlasses, exerciseMinutes } = req.body;

    let userGoal = await Goal.findOne({ userId });

    if (!userGoal) {
      // If no goal exists, create a new one
      userGoal = new Goal({ userId });
    }

    // Update the goal fields
    userGoal.sleepHours = sleepHours;
    userGoal.weightLbs = weightLbs;
    userGoal.stepsCounts = stepsCounts;
    userGoal.waterIntakeGlasses = waterIntakeGlasses;
    userGoal.exerciseMinutes = exerciseMinutes;

    await userGoal.save();
    res.status(200).json({ message: 'Goal updated successfully', userGoal });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating goal' });
  }
};