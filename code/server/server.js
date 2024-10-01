//This file is the main entrypoint for the backend of the application.
//It sets up and runs the server, it connects to the database, and it defines how the application responds to incoming requests.

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { getModel } from './db.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const User = getModel().userModel;
const Goal = getModel().goalModel;

app.use(cors());
app.use(express.json());

// WILL IMPLEMENT EXPRESS ROUTER--JUST USING THESE ROUTES FOR TESTING

app.get('/', (req, res) => {
  res.send('Server is running...');
});

app.get('/check-connection', async (req, res) => {
  res.sendStatus(200)
})

app.get('/view-users', async (req, res) => {
  const allUsers = await User.find({})
  res.json(allUsers)
})

app.post('/create-user', async (req, res) => {

  try {
    const { name, email, password } = req.body;
    // console.log('Create user request received', req.body);
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: 'Error: An account with this email already exists' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // console.log('Hashed password:', hashedPassword);

    // Autogenerate user ID based on maximum ID in users table
    let lastUser = await User.find().sort({"userId": -1}).limit(1) 
    let newUserId = lastUser[0].userId + 1 

    const newUser = new User({
      userId: newUserId,
      name: name,
      email: email,
      passwordHashed: hashedPassword
    })
    await newUser.save();
    res.status(201).json({ message: 'User created successfully!' });
    
  } catch (error) {
    // console.log('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user' });
  }

})


app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log('Login request received', { email, password });
    // Find the user by email
    const user = await User.findOne({ email: email });

    if (!user) {
      // User not found
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    // console.log('Password hash:', user.passwordHashed)
    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHashed);
    // console.log('Password validation result:', isPasswordValid);

    if (!isPasswordValid) {
      // Password does not match
      // console.log('Password does not match');
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Generate a token (e.g., JWT)
    const secretKey = process.env.SECRET_KEY; // Use environment variable in production
    // console.log('JWT_SECRET:', secretKey);

    if (!secretKey) {
      // console.error('JWT_SECRET  is not defined');
      return res.status(500).json({ message: 'Internal server error' });
    }

    const token = jwt.sign(
      { userId: user.userId, email: user.email },
      secretKey,
      { expiresIn: '1h' }
    );
    // console.log('JWT Secret:', process.env.SECRET_KEY);

    // Send the token to the client
    res.json({ token: token, message: 'Login successful' });

  } catch (error) {
    // console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/create-goal', async (req, res) => {
  try {
    // generate new ID based on max goal ID
    let lastGoal = await Goal.find().sort({"goalId": -1}).limit(1) 
    let newGoalId = lastGoal[0].goalId + 1 
    
    // define unit based on this pre-defined list
    let unit;
    switch (req.body.type) {
        case "sleep":
            unit = "hours";
            break;
        case "weight":
            unit = "lbs";
            break;
        case "steps":
            unit = "steps";
            break;
        case "water":
            unit = "glasses";
            break;
        case "exercise":
            unit = "minutes"; 
            break;
        default:
            unit = "unknown"; // default case
    }

    // create new goal and save to DB
    let newGoal = new Goal({
      goalId: newGoalId,
      type: req.body.type,
      targetValue: req.body.targetValue,
      unit: unit,
      // createdAt and progress will use defaults
    })
    await newGoal.save()
    
  } catch (error) {
    console.log(error)
  }
})

//Listen for incoming connections
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

