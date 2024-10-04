//This file is for defining the schema and retrieving data
//May turn this into two files moving forward (schema for one file, connection for another)

const mongoose = require('mongoose')
const dotenv = require('dotenv');
const path = require('path')

// Determine the correct .env file based on the environment
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';

// Load the appropriate .env file
// dotenv.config({ path: `../${envFile}` }); 
dotenv.config({ path: path.resolve(__dirname, `../${envFile}`) })


let connection = null
let userModel = null
let models = null


let Schema = mongoose.Schema

mongoose.Promise = global.Promise;

let progressSchema = new Schema({
    date: { type: Date, required: true },
    value: { type: Number, required: true }  
});

let goalSchema = new Schema({
	goalId: { type: Number, required: true },
	type: { type: String, required: true },
	targetValue: { type: Number, required: true },
    unit: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
	progress: {type: [progressSchema], default: [] } 
}, {
    collection: 'goals'
})

let userSchema = new Schema({
	userId: { type: Number, required: true },
	email: { type: String, required: true },
	passwordHashed: { type: String, required: true },
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
	goals: {type: [goalSchema], default: [] } 
}, {
    collection: 'users'
})

let dailyEntrySchema = new Schema({
	dailyEntryId: { type: Number, required: true },
	userId: { type: Number, required: true },
	entryDate: { type: Date },
	weight: { type: Number },
	steps: { type: Number },
	sleep: { type: Number },
	water: { type: Number },
	exercise: { type: Number }
}, {
    collection: 'daily_entries'
})

module.exports = {
    getModel: () => {
		if (connection == null) {
			connection = mongoose.createConnection(process.env.MONGO_URI)
			console.log("Connected to MongoDB!")
			userModel = connection.model("User", userSchema);
			goalModel = connection.model("Goal", goalSchema);
			dailyEntryModel = connection.model("DailyEntry", dailyEntrySchema);
			models = {userModel: userModel, goalModel: goalModel, dailyEntryModel: dailyEntryModel}
		}
		return models
	},
	closeConnection: () => {
		if (connection != null) {
			connection.close()
			console.log("MongoDB connection is closed")
		}
	}
}