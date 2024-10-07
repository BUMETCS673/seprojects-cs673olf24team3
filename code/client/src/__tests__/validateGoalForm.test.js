import { validateGoalForm } from '../utils/validateGoalForm';
import { getByRole, render, screen, waitFor, fireEvent } from '@testing-library/react';

import App from '../App'; 



test('All fields are empty strings', () => {
    const formData = {
        sleepHours: '',
        weightLbs: '',
        stepsCounts: '',
        waterIntakeGlasses: '',
        exerciseMinutes: ''
      };
      const result = validateGoalForm(formData);
      expect(result).toEqual({ isValid: false, message: 'Form field(s) missing' });
});

test('missing type field', () => {
    const formData = {
        sleepHours: '7',
        weightLbs: '',
        stepsCounts: '5000',
        waterIntakeGlasses: '5',
        exerciseMinutes: '60'
      };
      const result = validateGoalForm(formData);
      expect(result).toEqual({ isValid: false, message: 'Form field(s) missing' });
});

test('sleepHours is negative', () => {
    const formData = {
        sleepHours: -1,
        weightLbs: 100,
        stepsCounts: 7800,
        waterIntakeGlasses: 6,
        exerciseMinutes: 60
      };
      const result = validateGoalForm(formData);
      expect(result).toEqual({
        isValid: false,
        message: 'Sleep hours must be a number between 0 and 24'
      });
    });

test('weightLbs is negative', () => {
        const formData = {
            sleepHours: 7,
            weightLbs: -100,
            stepsCounts: 5000,
            waterIntakeGlasses: 5,
            exerciseMinutes: 60
          };
          const result = validateGoalForm(formData);
          expect(result).toEqual({
            isValid: false,
            message: 'Weight must be a positive number'
          });
        });

test('stepsCounts is negative', () => {
    const formData = {          
        sleepHours: 7,
        weightLbs: 100,
        stepsCounts: -5000,
        waterIntakeGlasses: 5,
        exerciseMinutes: 60 };
    const result = validateGoalForm(formData);  
    expect(result).toEqual({
      isValid: false,
      message: 'Steps cannot be negative'
    }); 
}); 

test('waterIntakeGlasses is negative', () => {
    const formData = {
        sleepHours: 7,
        weightLbs: 100,
        stepsCounts: 5000,
        waterIntakeGlasses: -5,
        exerciseMinutes: 60
      };
      const result = validateGoalForm(formData);
      expect(result).toEqual({
        isValid: false,
        message: 'Water intake cannot be negative'
      });
    });

test('exerciseMinutes is negative', () => {
    const formData = {
        sleepHours: 7,
        weightLbs: 100,
        stepsCounts: 5000,
        waterIntakeGlasses: 5,
        exerciseMinutes: -60
      };
      const result = validateGoalForm(formData);
      expect(result).toEqual({
        isValid: false,
        message: 'Exercise minutes cannot be negative'
      });
    });

test('All fields have valid values', () => {
        const formData = {
          sleepHours: 8,
          weightLbs: 150,
          stepsCounts: 10000,
          waterIntakeGlasses: 8,
          exerciseMinutes: 30
        };
        const result = validateGoalForm(formData);
        expect(result).toEqual({ isValid: true, message: 'Form is valid' });
});

