import apiClient from '../services/apiClient.js'


test('test connection to server', async () => {
  const response = await apiClient.get('/');
  expect(response.status).toBe(200);
})