const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User Schema
const userSchema = new Schema({
  userId: { type: Number, required: true },
  email: { type: String, required: true },
  passwordHashed: { type: String, required: true },
  name: { type: String, required: true },
  gender: { type: String, default: "na" },  
  dob: {                                     
    year: { type: Number, default: 1900, min: 1900, max: 2024 },
    month: { type: Number, default: 1, min: 1, max: 12 },
    day: { type: Number, default: 1, min: 1, max: 31 },
  },
  height: {
    feet: { type: Number, default: 0, min: 0, max: 7 },
    inches: { type: Number, default: 0, min: 0, max: 12 },
  },
  createdAt: { type: Date, default: Date.now }
}, {
  collection: 'users',
});

module.exports = mongoose.model('User', userSchema);