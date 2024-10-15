const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../server');  // Import the app, not the server instance
const DailyEntry = require('../models/DailyEntry');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { MongoMemoryServer } = require('mongodb-memory-server');
let mongoServer;
let token;

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
        passwordHashed: hashedPassword });
    const secretKey = process.env.SECRET_KEY || 'mydevelopmentsecret';
    token = jwt.sign({ userId: user.userId }, secretKey, { expiresIn: '1h' });
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});

describe('DailyEntry Controller Endpoints', () => {
    beforeEach(async () => {
        // Clear all daily entries before each test
        await DailyEntry.deleteMany({});
    });
  
    describe('Test creation, editing, and deletion of a daily entry', () => {
        it('should check for if there is an entryDate', async() => {
            const res = await request(app)
            .post('/api/daily-entry/enter-daily-data')
            .set('Authorization', `Bearer ${token}`)
            .send({ weight: 80 });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Entry date is missing');
        });

        it('should create a new daily entry successfully', async () => {
            const res = await request(app)
                .post('/api/daily-entry/enter-daily-data')
                .set('Authorization', `Bearer ${token}`)  // Use the token obtained in beforeAll
                .send({  entryDate: '2024-10-10', weight: 100, steps: 1000, sleep: 8, water: 5, exercise: 60});

            expect(res.statusCode).toEqual(201);
            expect(res.body.message).toBe('Daily entry created successfully!');
        });
            
        it('should edit an existing entry', async () => {
            // Create an entry to be edited
            await DailyEntry.create({
                dailyEntryId: 2,
                userId: 10001,
                entryDate: '2024-1-1',
                weight: 120,
                steps: 2000,
                sleep: 8,
                water: 3,
                exercise: 50,
            });

            // Edit entry
            const res = await request(app)
                .post('/api/daily-entry/enter-daily-data')
                .set('Authorization', `Bearer ${token}`)
                .send({
                dailyEntryId: 2,
                userId: 10001,
                weight: 115,
                steps: 2500,
                sleep: 8,
                water: 4,
                exercise: 60,
                entryDate: '2024-1-1',
            });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Daily entry updated successfully!");

            // Verify the contents
            const entry = await DailyEntry.findOne({ dailyEntryId: 2});
            expect(entry).toBeDefined();
            expect(entry.weight).toBe(115);
            expect(entry.steps).toBe(2500);
            expect(entry.sleep).toBe(8);
            expect(entry.exercise).toBe(60);
        });

        it('should delete an entry', async () => {
            // Create an entry to be deleted
            const entry = await DailyEntry.create({
                dailyEntryId: 1,
                userId: 10001,
                entryDate: '2023-1-1',
                weight: 100,
                steps: 1000,
                sleep: 8,
                water: 5,
                exercise: 60,
            });
            const res = await request(app)
            .delete('/api/daily-entry/delete-entry')
            .set('Authorization', `Bearer ${token}`)
            .send({ dailyEntryId: entry.dailyEntryId });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Daily entry deleted successfully!');
        });
    }); 
    
    describe('Test viewing daily entries', () => {
        it('should return a daily entry', async () => {
            // Create a daily entry for viewing
            await DailyEntry.create({
                dailyEntryId: 1,
                userId: 10001,
                entryDate: '2023-12-31',
                weight: 100,
                steps: 1000,
                sleep: 8,
                water: 5,
                exercise: 60,
            });
      
            const res = await request(app)
              .get('/api/daily-entry/view-daily-data')
              .set('Authorization', `Bearer ${token}`);
      
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveLength(1);
        });
    });

    describe('Test viewing for last seven days', () => {
        it('should return daily entries for the last seven days', async () => {
          // Create some entries for testing
          for (let i = 0; i < 7; i++) {
            await DailyEntry.create({
                dailyEntryId: 1,
                userId: 10001,
                entryDate: `2024-1-${31-i}`, // 1 day apart
                weight: 100 - i,
                steps: 1000 + i * 10,
                sleep: 5 + i,
                water: 3 + i,
                exercise: 60 + i * 5,
            });
          }
    
          const res = await request(app)
            .post('/api/daily-entry/last-seven-days')
            .set('Authorization', `Bearer ${token}`)
            .send({ dateString: "2024-1-31" });
    
          expect(res.statusCode).toBe(200);
          expect(res.body.data).toHaveLength(7);
        });
    });
});