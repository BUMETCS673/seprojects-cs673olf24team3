//This file is for defining the schema and retrieving data
//May turn this into two files moving forward (schema for one file, connection for another)

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import url from 'url';

// Determine the correct .env file based on the environment
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';

// Load the appropriate .env file
// dotenv.config({ path: `../${envFile}` }); 
const filename = url.fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
dotenv.config({ path: path.resolve(dirname, `../${envFile}`) })


let connection = null
let userModel = null
let models = {}


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
	goals: {type: [goalSchema], default: [] } ,
	friendRequestsReceived: {type: [String], default: []},
	friends: {type: [String], default: []}
}, {
    collection: 'users'
})

//add methods to schema
userSchema.methods.request = function(toUser) {
	toUser.friendRequestsReceived.push(this.email)
}

userSchema.methods.accept = function(fromUser) {
    const indexToRemove = this.friendRequestsReceived.indexOf(fromUser.email);
    if (indexToRemove !== -1) {
        this.friendRequestsReceived.splice(indexToRemove, 1);
        this.friends.push(fromUser.email)
        fromUser.friends.push(this.email)
    }
}

// module.exports = {
//     getModel: () => {
// 		if (connection == null) {
// 			connection = mongoose.createConnection(process.env.MONGO_URI)
// 			console.log("Connected to MongoDB!")
// 			userModel = connection.model("User", userSchema);
// 			goalModel = connection.model("Goal", goalSchema);
// 			models = {userModel: userModel, goalModel: goalModel}
// 		}
// 		return models
// 	},
// 	closeConnection: () => {
// 		if (connection != null) {
// 			connection.close()
// 			console.log("MongoDB connection is closed")
// 		}
// 	}
// }

export const getModel = () => {
    if (connection == null) {
        connection = mongoose.createConnection(process.env.MONGO_URI);
        console.log("Connected to MongoDB!");
        models.userModel = connection.model("User", userSchema);
        models.goalModel = connection.model("Goal", goalSchema);
    }
    return models;
};

export const closeConnection = () => {
    if (connection != null) {
        connection.close();
        console.log("MongoDB connection is closed");
    }
};