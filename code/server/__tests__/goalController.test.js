const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../server');  // Import the app, not the server instance
const Goal = require('../models/Goal');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { MongoMemoryServer } = require('mongodb-memory-server');
let mongoServer;
let token;  // Declare token to be used in all tests

beforeAll(async () => {
  process.env.NODE_ENV = 'test';  // Set NODE_ENV to test
  
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  console.log('mongoose uri:', uri);

  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await User.create({ 
    userId: 10001, 
    name: 'Test User',
    email: 'test@example.com', 
    passwordHashed: 'hashedPassword' });
  const secretKey = process.env.SECRET_KEY || 'mydevelopmentsecret';
  token = jwt.sign({ userId: user.userId }, secretKey, { expiresIn: '1h' });
 


});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();

});

describe('Goal Controller Endpoints', () => {
  beforeEach(async () => {
    // Clear all goals before each test
    await Goal.deleteMany({});
  });

  // Test for successful goal creation
  it('should create a new goal successfully', async () => {
    const res = await request(app)
      .post('/api/goals')
      .set('Authorization', `Bearer ${token}`)  // Use the token obtained in beforeAll
      .send({  sleepHours: 8});

    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toBe('Goal updated successfully');
    expect(res.body.userGoal).toBeDefined();
    expect(res.body.userGoal._id).toBeDefined();

    // Verify the goal is created in the database
    const goal = await Goal.findById(res.body.userGoal._id);

    expect(goal).toBeDefined();
    expect(goal.sleepHours).toBe(8);
  });


  it('should create a new goal with the correct unit for type "water"', async () => {
    const res = await request(app)
      .post('/api/goals')
      .set('Authorization', `Bearer ${token}`)  // Use the same token here
      .send({ waterIntakeGlasses: 10 });

    expect(res.statusCode).toEqual(201);
    expect(res.body.userGoal).toBeDefined();  // Check that goalId is returned
    expect(res.body.userGoal._id).toBeDefined();

    // Verify the goal is created with correct unit
    const goal = await Goal.findById(res.body.userGoal._id);
    expect(goal).toBeDefined();
    expect(goal.waterIntakeGlasses).toBe(10);
  });
  
});