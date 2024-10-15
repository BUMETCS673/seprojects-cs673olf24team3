const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../server');  // Import the app, not the server instance
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { MongoMemoryServer } = require('mongodb-memory-server');
let mongoServer;

let server;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';  // Set NODE_ENV to test
  
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  console.log('mongoose uir:', uri);
  server = app.listen(5001);  // Start the test server
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
  if (server) server.close();
});

describe('User Controller Endpoints', () => {
  beforeEach(async () => {
    await User.deleteMany({});  // Clear all users before each test
  });

  describe('GET /api/users/view-users', () => {
    it('should return a list of all users', async () => {
      await User.create({ userId: 1, name: 'John Doe', email: 'john@example.com', passwordHashed: 'hashedPassword' });
    
      const res = await request(app).get('/api/users/view-users');
      console.log('Response:', res.body); // Add this to inspect the response
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe('John Doe');
    });

    it('should handle errors and return 500', async () => {
      jest.spyOn(User, 'find').mockImplementationOnce(() => {
        throw new Error('Error retrieving users');
      });

      const res = await request(app).get('/api/users/view-users');
      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe('Error retrieving users');
    });
  });


  describe('GET /api/users/manage-profile', () => {

    const createAndLoginUser = async () => {
      // Create a new user
      await User.create({
        userId: 10001,
        name: 'Jane Doe',
        email: 'jane@example.com',
        passwordHashed: await bcrypt.hash('password123', 10)
      });
  
      // Login the user and get the token
      const loginResponse = await request(app)
        .post('/api/users/login') // Adjust this path based on your login route
        .send({
          email: 'jane@example.com',
          password: 'password123'
        });
  
      // Return the token from the login response
      return loginResponse.body.token;
    };

    it('should return the user profile if user exists', async () => {
      // Get the token by creating and logging in a user
      const token = await createAndLoginUser();

      // Make a request to the protected route with the token
      const res = await request(app)
        .get('/api/users/manage-profile')
        .set('Authorization', `Bearer ${token}`);

      // Assert the response
      expect(res.statusCode).toEqual(200);
      expect(res.body.name).toBe('Jane Doe');
    });

    it('should return 404 if the user does not exist', async () => {
      // Get a token for a non-existent user (you can skip creating a user for this test)
      const token = await createAndLoginUser();

      // Manually delete the user to simulate a non-existent user
      await User.deleteOne({ email: 'jane@example.com' });

      // Make the request with the token
      const res = await request(app)
        .get('/api/users/manage-profile')
        .set('Authorization', `Bearer ${token}`);

      // Assert the response
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toBe('User not found');
    });

    // Move the "update the user profile" test inside the correct describe block
    it('should update the user profile', async () => {
      // Create the user before attempting to update
      const user = await User.create({
        userId: 10001,
        name: 'John Doe',
        email: 'john@example.com',
        passwordHashed: 'hashedPassword',
      });
    
      // Log the created user to make sure it was inserted correctly
      console.log('Created user:', user);
      console.log('Created user with userId:', user.userId, typeof user.userId);  // Check the type of userId
    
      // Send the update request
      const res = await request(app)
        .post('/api/users/manage-profile')
        .send({
          userId: 10001,  // Ensure this matches the userId in the database
          name: 'John Updated',
          gender: 'Male',
          dob: { year: 1990, month: 1, day: 1 },
          height: { feet: 6, inches: 2 },
        });
    
      // Log the response for debugging
      console.log('Response status code:', res.statusCode);
      console.log('Response body:', res.body);
    
      // Assertions
      expect(res.statusCode).toEqual(200);  // Expect a successful profile update
      expect(res.body.message).toBe('Profile updated successfully');
      expect(res.body.userProfile.name).toBe('John Updated');
    });
  });

  describe('POST /api/users/create-user', () => {
    it('should create a new user', async () => {
      const res = await request(app)
        .post('/api/users/create-user')
        .send({
          name: 'Test User',
          email: 'testuser@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.message).toBe('User created successfully!');
    });

    it('should return 400 if the user already exists', async () => {
      await User.create({
        userId: 1,
        name: 'Test User',
        email: 'testuser@example.com',
        passwordHashed: await bcrypt.hash('password123', 10),
      });

      const res = await request(app)
        .post('/api/users/create-user')
        .send({
          name: 'Test User',
          email: 'testuser@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toBe('An account with this email already exists');
    });
  });

  describe('POST /api/users/login', () => {
    it('should log in a user and return a token', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await User.create({
        userId: 1,
        name: 'Test User',
        email: 'testuser@example.com',
        passwordHashed: hashedPassword,
      });

      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: 'testuser@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.message).toBe('Login successful');
    });

    it('should return 401 if the email or password is incorrect', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'wrongpassword',
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toBe('Invalid email or password.');
    });
  });
});
