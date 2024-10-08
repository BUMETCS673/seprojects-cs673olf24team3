const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dailyEntrySchema = new Schema({
  dailyEntryId: { type: Number, required: true },
  userId: { type: Number, required: true },
  entryDate: { type: Date, default: Date.now },
  weight: { type: Number },
  steps: { type: Number },
  sleep: { type: Number },
  water: { type: Number },
  exercise: { type: Number },
}, {
  collection: 'daily_entries',
});

module.exports = mongoose.model('DailyEntry', dailyEntrySchema);
