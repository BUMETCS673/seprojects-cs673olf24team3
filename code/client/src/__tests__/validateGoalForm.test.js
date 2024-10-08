import { validateGoalForm } from '../utils/validateGoalForm';
import { getByRole, render, screen, waitFor, fireEvent } from '@testing-library/react';

import App from '../App'; 



test('empty input form fields', () => {
    const formData = { type: '', targetValue: '' };
    const result = validateGoalForm(formData);
    expect(result).toEqual({ isValid: false, message: 'Type is required and must be a non-empty string' });
});

test('missing type field', () => {
    const formData = { targetValue: 100 };
    const result = validateGoalForm(formData);
    expect(result).toEqual({ isValid: false, message: 'Type is required and must be a non-empty string' });
});

test('type field with non-string value', () => {
    const formData = { type: 123, targetValue: 100 };
    const result = validateGoalForm(formData);
    expect(result).toEqual({ isValid: false, message: 'Type is required and must be a non-empty string' });
});

test('targetValue field with non-number value', () => {
    const formData = { type: 'Weight Loss', targetValue: 'invalid' };
    const result = validateGoalForm(formData);
    expect(result).toEqual({ isValid: false, message: 'Target value must be a valid number greater than or equal to zero' });
});

test('targetValue less than zero', () => {
    const formData = { type: 'Weight Loss', targetValue: -5 };
    const result = validateGoalForm(formData);
    expect(result).toEqual({ isValid: false, message: 'Target value must be a valid number greater than or equal to zero' });
});

test('valid form data', () => {
    const formData = { type: 'Weight Loss', targetValue: 10 };
    const result = validateGoalForm(formData);
    expect(result).toEqual({ isValid: true, message: 'Form is valid' });
});

test('targetValue is zero', () => {
    const formData = { type: 'Weight Maintenance', targetValue: 0 };
    const result = validateGoalForm(formData);
    expect(result).toEqual({ isValid: true, message: 'Form is valid' });
});

test('type field with leading/trailing spaces', () => {
    const formData = { type: '   Weight Loss  ', targetValue: 5 };
    const result = validateGoalForm(formData);
    expect(result).toEqual({ isValid: true, message: 'Form is valid' });
});

test('targetValue is NaN', () => {
    const formData = { type: 'Weight Loss', targetValue: NaN };
    const result = validateGoalForm(formData);
    expect(result).toEqual({ isValid: false, message: 'Target value must be a valid number greater than or equal to zero' });
});
