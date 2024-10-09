// tests/authenticateUser.test.js
import { authenticateUser } from '../utils/authenticateUser';
const mockUserDatabase = [
  { email: 'user1@test.com', password: 'Test123' },
  { email: 'user2@test.com', password: 'Secret456' },
];
test('successful login with correct credentials', async () => {
  const credentials = { email: 'user1@test.com', password: 'Test123' };
  const result = await authenticateUser(credentials, mockUserDatabase);
  expect(result).toBe(true);
});
test('login fails with incorrect password', async () => {
  const credentials = { email: 'user1@test.com', password: 'WrongPassword' };
  const result = await authenticateUser(credentials, mockUserDatabase);
  expect(result).toBe(false);
});
test('login fails with non-existent email', async () => {
  const credentials = { email: 'nonexistent@test.com', password: 'Test123' };
  const result = await authenticateUser(credentials, mockUserDatabase);
  expect(result).toBe(false);
});
test('login fails when email is missing', async () => {
  const credentials = { email: '', password: 'Test123' };
  const result = await authenticateUser(credentials, mockUserDatabase);
  expect(result).toBe(false);
});
test('login fails when password is missing', async () => {
  const credentials = { email: 'user1@test.com', password: '' };
  const result = await authenticateUser(credentials, mockUserDatabase);
  expect(result).toBe(false);
});