const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Progress Schema
const progressSchema = new Schema({
  date: { type: Date, required: true },
  value: { type: Number, required: true },
});

// Goal Schema
// const goalSchema = new Schema({
//   goalId: { type: Number, required: true },
//   type: { type: String, required: true },
//   targetValue: { type: Number, required: true },
//   unit: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now },
//   progress: { type: [progressSchema], default: [] },  // Array of progress entries
// });

// User Schema
const userSchema = new Schema({
  userId: { type: Number, required: true },
  email: { type: String, required: true },
  passwordHashed: { type: String, required: true },
  name: { type: String, required: true },
  gender: { type: String, default: "na" },  // New field for gender
  dob: {                                     // New field for date of birth
    year: { type: Number, default: 1900, min: 1900, max: 2024 },
    month: { type: Number, default: 1, min: 1, max: 12 },
    day: { type: Number, default: 1, min: 1, max: 31 },
  },
  height: {                                  // New field for height
    feet: { type: Number, default: 0, min: 0, max: 7 },
    inches: { type: Number, default: 0, min: 0, max: 12 },
  },
  createdAt: { type: Date, default: Date.now }
}, {
  collection: 'users',
});

module.exports = mongoose.model('User', userSchema);