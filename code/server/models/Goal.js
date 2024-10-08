const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Goal Schema
const goalSchema = new Schema({
  goalId: { type: Number, required: true },
  type: { type: String, required: true },
  targetValue: { type: Number, required: true },
  unit: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  userId: { type: Number, required: false }
}, {
  collection: 'goals',  // Specify the collection name
});

module.exports = mongoose.model('Goal', goalSchema);