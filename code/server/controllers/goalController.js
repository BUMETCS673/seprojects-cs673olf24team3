const Goal = require('../models/Goal');
const jwt = require('jsonwebtoken');

// Create a new goal
exports.getGoal  = async (req, res) => {
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
    const secretKey = process.env.SECRET_KEY || 'mydevelopmentsecret';
    if (!secretKey) {
      return res.status(500).json({ message: 'Secret key is missing in the environment variables' });
    }

    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.userId;

    let userGoal = await Goal.findOne({ userId });

    if (!userGoal) {
      return res.status(200).json({
        sleepHours: "",
        weightLbs: "",
        stepsCounts: "",
        waterIntakeGlasses: "",
        exerciseMinutes: ""
      });
    }

    res.status(200).json(userGoal);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching goal' });
  }
};

exports.createOrUpdateGoal  = async (req, res) => {
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
    const secretKey = process.env.SECRET_KEY || 'mydevelopmentsecret';
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.userId;

    const { sleepHours, weightLbs, stepsCounts, waterIntakeGlasses, exerciseMinutes } = req.body;

    let userGoal = await Goal.findOne({ userId });

    if (!userGoal) {
      // If no goal exists, create a new one
      userGoal = new Goal({ userId });
    }

    // Update the goal fields
    if (sleepHours !== undefined) userGoal.sleepHours = sleepHours;
    if (weightLbs !== undefined) userGoal.weightLbs = weightLbs;
    if (stepsCounts !== undefined) userGoal.stepsCounts = stepsCounts;
    if (waterIntakeGlasses !== undefined) userGoal.waterIntakeGlasses = waterIntakeGlasses;
    if (exerciseMinutes !== undefined) userGoal.exerciseMinutes = exerciseMinutes;

    await userGoal.save();
    res.status(201).json({ message: 'Goal updated successfully', userGoal: userGoal });
  } catch (error) {
    res.status(500).json({ message: 'Error updating goal' });
  }
};