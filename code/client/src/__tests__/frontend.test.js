import apiClient from '../services/apiClient.js'
import { render, screen } from '@testing-library/react';
import App from '../App';

// tests
test('test connection to server', async () => {
  const response = await apiClient.get('/check-connection');
  expect(response.status).toBe(200);
})

test('renders home text', () => {
  render(<App />);
  const homeElement = screen.getByText(/welcome to the home page/i); // case-insensitive due to the regular expression /i
  expect(homeElement).toBeInTheDocument();
});
