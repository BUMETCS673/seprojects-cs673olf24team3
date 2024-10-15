// This file is for initializing data to the MongoDB database 
const db = require("../config/db.js");
const Goal = require("../models/Goal.js");
const DailyEntry = require("../models/DailyEntry.js");
const getLastSevenDays = require('./getLastSevenDays')

async function init() {
    try {
        // Connect to MongoDB
        await db.connectDB();

        //initialize data for this user
        const userId = 10003
        
        // Option to delete existing data for full reset (uncomment if needed)
        // await Goal.deleteMany({ userId: userId });
        // await DailyEntry.deleteMany({ userId: userId });

        // Hardcoded goal data for user 10003
        let goal = new Goal({
            userId: userId,
            weightLbs: 140,          // Weight goal
            stepsCounts: 10000,      // Steps goal
            sleepHours: 7,           // Sleep goal
            waterIntakeGlasses: 8,   // Water Intake goal
            exerciseMinutes: 40      // Exercise goal
        });

        //Get the last seven days
        const today = new Date()
        const todayString = today.toLocaleDateString("en-CA")
        const lastSevenDays = getLastSevenDays(todayString);
        
        // Daily entries data for user 10003
        const weightData = [150, 149, 148, 147, 146, 145, 144];
        const stepsData = [6000, 8000, 7500, 9000, 6500, 5000, 7000];
        const sleepData = [6, 7, 5, 8, 6, 7, 5];
        const waterData = [8, 6, 7, 5, 8, 7, 6];
        const exerciseData = [30, 45, 60, 20, 40, 30, 50];

        // Create daily entries for user 10003
        const dailyEntries = lastSevenDays.map((date, index) => {
            return new DailyEntry({
                dailyEntryId: index + 1,  // Incremental ID
                userId: userId,            // User ID
                entryDate: date,          // Date (set in UTC)
                weight: weightData[index],  // Weight data
                steps: stepsData[index],    // Steps data
                sleep: sleepData[index],    // Sleep data
                water: waterData[index],    // Water Intake data
                exercise: exerciseData[index] // Exercise data
            });
        });

        // Save goal and daily entries to the database
        await Promise.all([
            goal.save(),
            ...dailyEntries.map(entry => entry.save()) // Save all daily entries
        ]);

        // Log saved data for confirmation
        let goals = await Goal.find({ userId: userId });
        console.log("Goals for user 10003:", goals);

        let dailyEntriesForUser = await DailyEntry.find({ userId: userId });
        console.log("Daily Entries for user 10003:", dailyEntriesForUser);

    } catch (error) {
        console.log(error);
    } finally {
        db.closeConnection();
    }
}

init();
