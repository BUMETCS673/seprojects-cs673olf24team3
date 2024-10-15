const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Goal Schema
const goalSchema = new Schema({
  userId: { type: Number, required: true },
  sleepHours: { type: Number, default: 0 },
  weightLbs: { type: Number, default: 0 },
  stepsCounts: { type: Number, default: 0 },
  waterIntakeGlasses: { type: Number, default: 0 },
  exerciseMinutes: { type: Number, default: 0 },
}, {
  collection: 'goals', 
});

module.exports = mongoose.model('Goal', goalSchema);