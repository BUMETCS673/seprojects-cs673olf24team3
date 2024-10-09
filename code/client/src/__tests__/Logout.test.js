// LogoutButton.test.js

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import LogoutButton from '../components/Logout.js';
import { BrowserRouter } from 'react-router-dom';

//  Mock the useNavigate function
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('LogoutButton Component', () => {
  beforeEach(() => {
    //  Set up any necessary mocks before each test
    localStorage.setItem('authToken', 'test-token');
  });

  afterEach(() => {
    
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('should render correctly', () => {
    const { getByText } = render(
      <BrowserRouter>
        <LogoutButton setIsAuthenticated={() => {}} />
      </BrowserRouter>
    );

    expect(getByText('Logout')).toBeInTheDocument();
  });

  test('should handle logout correctly', () => {
    const mockSetIsAuthenticated = jest.fn();
    const mockNavigate = jest.fn();

    //  Set up any necessary mocks before each test
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => mockNavigate);

    const { getByText } = render(
      <BrowserRouter>
        <LogoutButton setIsAuthenticated={mockSetIsAuthenticated} />
      </BrowserRouter>
    );

    // Click on the Logout button
    fireEvent.click(getByText('Logout'));

    //  Check if localStorage.getItem('authToken') is null
    expect(localStorage.getItem('authToken')).toBeNull();

    //  Check if setIsAuthenticated is called with false
    expect(mockSetIsAuthenticated).toHaveBeenCalledWith(false);

    //  Check if mockNavigate is called with '/login'
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
