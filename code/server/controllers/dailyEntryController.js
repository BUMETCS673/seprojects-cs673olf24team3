const DailyEntry = require("../models/DailyEntry");
const jwt = require('jsonwebtoken');
const getLastSevenDays = require('../utils/getLastSevenDays');

// Enter daily data
exports.enterDailyData = async (req, res) => {
  try {

    // GET THE USER ID

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
    


    //GET THE REQUEST BODY DATA

    const { weight, steps, sleep, water, exercise, entryDate } = req.body;

    //EITHER update data (if an entry exists with the given day) or create a new daily entry
    if (!entryDate) {
      return res.status(400).json({ message: 'Entry date is missing' });
    }
    // Split the "YYYY-MM-DD" date string
    const [year, month, day] = entryDate.split('-').map(Number);

    // Create a new Date in local time (months are 0-indexed in JavaScript)
    const entryDateStart = new Date(Date.UTC(year, month - 1, day)); //month is zero indexed
    entryDateStart.setUTCHours(0, 0, 0, 0); // Ensure time is set to 00:00:00

    // Check if an entry for this date already exists for this user
    const existingEntry = await DailyEntry.findOne({
      userId: userId,
      entryDate: {
        $gte: entryDateStart, // Date should be >= 00:00:00 of the entry date
        $lt: new Date(entryDateStart.getTime() + 24 * 60 * 60 * 1000) // Less than the start of the next day
      }
    });

    if (existingEntry) {
      // If an entry exists, update it
      existingEntry.weight = weight;
      existingEntry.steps = steps;
      existingEntry.sleep = sleep;
      existingEntry.water = water;
      existingEntry.exercise = exercise;

      await existingEntry.save();
      return res.status(200).json({ message: "Daily entry updated successfully!" });
    } else {
      // If no entry exists for this day, create a new one
      let lastEntry = await DailyEntry.find().sort({ dailyEntryId: -1 }).limit(1);
      let newEntryId = lastEntry.length > 0 ? lastEntry[0].dailyEntryId + 1 : 1;

      const newDailyEntry = new DailyEntry({
        dailyEntryId: newEntryId,
        userId: userId,
        entryDate: entryDateStart,
        weight,
        steps,
        sleep,
        water,
        exercise,
      });

      await newDailyEntry.save();
      return res.status(201).json({ message: "Daily entry created successfully!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error creating or updating daily entry" });
  }
};


//View daily data
exports.viewDailyData = async (req,res) => {
  
  // res.send("viewing daily data...")
  
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

    const userDailyData = await DailyEntry.find({ userId: userId }).sort({ entryDate: -1 });;

    if (!userDailyData) {
      return res.status(404).json({ message: 'User daiy data not found' });
    }

    res.json(userDailyData);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

//Delete a daily entry
exports.deleteEntry = async (req, res) => {
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

    // Extract dailyEntryId from the request (passed in body, params, or query)
    const { dailyEntryId } = req.body;

    if (!dailyEntryId) {
      return res.status(400).json({ message: 'dailyEntryId is required' });
    }

    // Find and delete the entry by dailyEntryId and userId (to ensure user owns the entry)
    const deletedEntry = await DailyEntry.findOneAndDelete({
      dailyEntryId: dailyEntryId,
      userId: userId
    });

    if (deletedEntry) {
      return res.status(200).json({ message: 'Daily entry deleted successfully!' });
    } else {
      return res.status(404).json({ message: 'Daily entry not found' });
    }

  } catch (error) {
    res.status(500).json({ message: 'Error deleting daily entry' });
  }
};

exports.lastSevenDays = async (req, res) => {
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

    // Get the dateString from the request body
    const { dateString } = req.body;
    if (!dateString) {
      return res.status(400).json({ message: 'dateString is required' });
    }

    // Get the last seven days using the helper function
    const lastSevenDays = getLastSevenDays(dateString);
    const responseData = [];

    // Loop through the last seven days and fetch entries
    for (let d = 0; d < lastSevenDays.length; d++) {
      const day = lastSevenDays[d];

      // Find entry for the current day with exact match
      const entry = await DailyEntry.findOne({
        userId: userId, // Ensure the userId is included in the query
        entryDate: day, // Match the exact entryDate
      });

      // Push entry or null if not found
      if (entry) {
        responseData.push({day: day, data: entry});
      } else {
        responseData.push({day: day, data: null});
      }
    }

    // Send the array of data to the client
    return res.status(200).json({
      data: responseData
    });

  } catch (error) {
    res.status(500).json({ message: 'Error getting last seven days of data' });
  }
};