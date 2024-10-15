import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
import { destroyCookie } from 'nookies';
import App from '../App.js';

// Mock the authenticated function to prevent redirection
jest.mock('../utils/authenticate.js', () => ({
  authenticated: jest.fn(),
}));

beforeEach(() => {
  // Simulate authenticated user
  Cookies.set('authToken', 'mock-token');
});

afterEach(() => {
  // Cleanup cookie
  destroyCookie(null, 'authToken');
});

test('renders home page after login', () => {
  render(
    <App RouterComponent={MemoryRouter} /> 
  );

  const welcomeMessage = screen.getByText(/Welcome/i);
  expect(welcomeMessage).toBeInTheDocument();
});