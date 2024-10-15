// This file is for initializing data to the MongoDB database 

const bcrypt = require('bcrypt');
const db = require("../config/db.js")

const User = require("../models/User.js");
const Goal = require("../models/Goal.js");
const DailyEntry = require("../models/DailyEntry.js");

async function init() {
    try {
        // Connect to MongoDB
        await db.connectDB();
        
        // Option to delete existing data for full reset
        // await User.deleteMany({})
        // await Goal.deleteMany({})
        // await DailyEntry.deleteMany({})
        
        // hashing "password" to be used as default password for users created here
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash("password", saltRounds); 


        let goal1 = new Goal({
            userId: 10001,
            weightLbs: 140,
            stepsCounts: 10000,
            sleepHours: 7,
            waterIntakeGlasses: 8,
            exerciseMinutes: 40
        })

        let user1 = new User({
            userId: 10001,
            email: "akyee@bu.edu",
            passwordHashed: hashedPassword,
            name: "Amanda Yee",
            createdAt: "2024-09-01"
        })

        let user2 = new User({
            userId: 10002,
            email: "abbieyl@bu.edu",
            passwordHashed: hashedPassword,
            name: "Abbie-Yu Luo"
        })

        let user3 = new User({
            userId: 10003,
            email: "ccerav@bu.edu",
            passwordHashed: hashedPassword,
            name: "Chris Ceravolo"
        })

        let user4 = new User({
            userId: 10004,
            email: "elee27@bu.edu",
            passwordHashed: hashedPassword,
            name: "Eddie Lee"
        })

        let user5 = new User({
            userId: 10005,
            email: "kenlight@bu.edu",
            passwordHashed: hashedPassword,
            name: "Kenny Light"
        })

        let user6 = new User({
            userId: 10006,
            email: "zihaoq@bu.edu",
            passwordHashed: hashedPassword,
            name: "Zihao Qian"
        })

        let dailyEntry1 = new DailyEntry({
            dailyEntryId: 1,
            userId: 10001,
            entryDate: "2024-10-04",
            weight: 150,
            steps: 9999,
            sleep: 7.5,
            water: 4,
            exercise: 45
        })
    
        await Promise.all([
            user1.save(), user2.save(), user3.save(),
            user4.save(), user5.save(), user6.save(),
            goal1.save(),
            dailyEntry1.save()
        ])
    
        let users = await User.find({})
        console.log(users)

        let goals = await Goal.find({})
        console.log(goals)

        let dailyEntries = await DailyEntry.find({})
        console.log(dailyEntries)

    } catch(error) {
        console.log(error)
    } finally {
        db.closeConnection()
    }
}

init()
