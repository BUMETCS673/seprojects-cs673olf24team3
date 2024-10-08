// frontend.test.js
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App.js';

// Mock the charts
jest.mock('react-chartjs-2', () => ({
  Line: () => <div>Mocked Line Chart</div>,
}));

// Mock the authenticated function to prevent redirection
jest.mock('../utils/authenticate.js', () => ({
  authenticated: jest.fn(),
}));

beforeEach(() => {
  // Simulate authenticated user
  localStorage.setItem('authToken', 'mock-token');
});

afterEach(() => {
  // Cleanup localStorage
  localStorage.removeItem('authToken');
});

test('renders home page with mocked charts', () => {
  render(
    <App RouterComponent={MemoryRouter} /> 
  );

  const mockCharts = screen.getAllByText(/Mocked Line Chart/i);
  expect(mockCharts[0]).toBeInTheDocument();
  expect(mockCharts).toHaveLength(5); // Adjust based on the number of charts expected
});