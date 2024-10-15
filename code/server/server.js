const express = require('express');
const cookieParser = require('cookie-parser')
const cors = require('cors');
const db = require('./config/db');  // Assuming you have a separate db connection file

const app = express();
const port = process.env.PORT || 5000;

app.use(cookieParser());
app.use(cors());
app.use(express.json());

require('dotenv').config();

// Connect to MongoDB
db.connectDB();

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/goals', require('./routes/goalRoutes'));
app.use('/api/daily-entry', require('./routes/dailyEntryRoutes'));

// Test route
app.get('/', (req, res) => res.send('Server is running...'));

// Export the app without starting the server
module.exports = app;

// Start the server only when the file is run directly (not during tests)
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}