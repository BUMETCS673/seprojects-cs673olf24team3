const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../server');  // Import the app, not the server instance
const Goal = require('../models/Goal');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { MongoMemoryServer } = require('mongodb-memory-server');
let mongoServer;
let server;
let token;  // Declare token to be used in all tests

beforeAll(async () => {
  process.env.NODE_ENV = 'test';  // Set NODE_ENV to test
  
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  console.log('mongoose uri:', uri);
  server = app.listen(5001);  // Start the test server

  // Create a user and get the token before all tests
  const hashedPassword = await bcrypt.hash('password123', 10);
  await User.create({
    userId: 10001,
    name: 'Jane Doe',
    email: 'jane@example.com',
    passwordHashed: hashedPassword
  });

  // Login the user and get the token
  const loginResponse = await request(app)
    .post('/api/users/login')
    .send({
      email: 'jane@example.com',
      password: 'password123'
    });

  // Store the token to be reused in all tests
  token = loginResponse.body.token;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
  if (server) server.close();
});

describe('Goal Controller Endpoints', () => {
  beforeEach(async () => {
    // Clear all goals before each test
    await Goal.deleteMany({});
  });

  // Test for successful goal creation
  it('should create a new goal successfully', async () => {
    const res = await request(app)
      .post('/api/goals/create-goal')
      .set('Authorization', `Bearer ${token}`)  // Use the token obtained in beforeAll
      .send({ type: 'sleep', targetValue: 8 });

    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toBe('New goal created successfully');
    expect(res.body.goalId).toBeDefined();  // Check that goalId is returned

    // Verify the goal is created in the database
    const goal = await Goal.findOne({ goalId: res.body.goalId });
    expect(goal).toBeDefined();
    expect(goal.type).toBe('sleep');
    expect(goal.targetValue).toBe(8);
    expect(goal.unit).toBe('hours');  // 'sleep' should have 'hours' as unit
  });

  // Other tests that require the token...

  it('should create a new goal with the correct unit for type "water"', async () => {
    const res = await request(app)
      .post('/api/goals/create-goal')
      .set('Authorization', `Bearer ${token}`)  // Use the same token here
      .send({ type: 'water', targetValue: 10 });

    expect(res.statusCode).toEqual(201);
    expect(res.body.goalId).toBeDefined();  // Check that goalId is returned

    // Verify the goal is created with correct unit
    const goal = await Goal.findOne({ goalId: res.body.goalId });
    expect(goal.unit).toBe('glasses');  // 'water' should have 'glasses' as unit
  });

  // Other tests that require token...
});