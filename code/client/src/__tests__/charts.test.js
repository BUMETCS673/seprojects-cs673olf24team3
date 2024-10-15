// Import necessary libraries and your component
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; 
import Home from '../components/Home'; 
import React from 'react';

jest.mock('../utils/authenticate.js', () => ({
  authenticated: jest.fn(() => 'fake-token'),
}));

jest.mock('../components/ChartBox', () => {
  return function MockChartBox(props) {
    return <div data-testid="mock-chart-box">{props.title}</div>;
  };
});

const mockLastSevenDaysData = [
  { day: '2024-10-07', data: { weight: 180, steps: 10000, sleep: 7, water: 8, exercise: 30 } },
  { day: '2024-10-08', data: { weight: 181, steps: 9000, sleep: 6, water: 7, exercise: 25 } },
  { day: '2024-10-09', data: { weight: 179, steps: 11000, sleep: 8, water: 8, exercise: 35 } },
  { day: '2024-10-10', data: { weight: 180, steps: 9500, sleep: 7.5, water: 9, exercise: 40 } },
  { day: '2024-10-11', data: { weight: 182, steps: 10000, sleep: 7, water: 8, exercise: 45 } },
  { day: '2024-10-12', data: { weight: 183, steps: 10500, sleep: 6.5, water: 7, exercise: 50 } },
  { day: '2024-10-13', data: { weight: 184, steps: 12000, sleep: 8, water: 9, exercise: 60 } },
];

const mockNoData = [
  { day: '2024-10-01', data: null }, 
  { day: '2024-10-02', data: null },
  { day: '2024-10-03', data: null },
  { day: '2024-10-04', data: null },
  { day: '2024-10-05', data: null },
  { day: '2024-10-06', data: null },
  { day: '2024-10-07', data: null },
];

describe('Home component', () => {
  test('renders five charts with titles Weight, Steps, Sleep, Water, and Exercise when user has data', () => {
    render(<Home initialData={mockLastSevenDaysData} />);
    
    const chartTitles = ['Weight', 'Steps', 'Sleep', 'Water', 'Exercise'];
    chartTitles.forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument(); // Assert that the title is present
    });
  });

  test('displays no data message when all data is null', async () => {
    render(<Home initialData={mockNoData} />);
    
    const noDataMessage = await screen.findByText(
      'Enter some daily data for the past week to see your progress'
    );

    expect(noDataMessage).toBeInTheDocument();
  });
});