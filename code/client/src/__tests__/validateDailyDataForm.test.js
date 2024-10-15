import { validateDailyDataForm } from '../utils/validateDailyDataForm'; 

// Invalid tests
test('empty input form fields', () => {
    const formData = { weight: '', water: 4, steps: 10000, sleep: 8, exercise: 30, entryDate: '2024-10-01'};
    const result = validateDailyDataForm(formData);
    expect(result.isValid).toBe(false);
});

test('negative values', () => {
    const formData = { weight: 150, water: -10, steps: 10000, sleep: 8, exercise: 30, entryDate: '2024-10-01'};
    const result = validateDailyDataForm(formData);
    expect(result.isValid).toBe(false);
});

test('sleep exceeds limit', () => {
    const formData = { weight: 150, water: 4, steps: 10000, sleep: 30, exercise: 0, entryDate: '2024-10-11'};
    const result = validateDailyDataForm(formData);
    expect(result.isValid).toBe(false);
});

test('exercise exceeds limit', () => {
    const formData = { weight: 150, water: 4, steps: 10000, sleep: 6, exercise: 10000, entryDate: '2024-10-11'};
    const result = validateDailyDataForm(formData);
    expect(result.isValid).toBe(false);
});

// Valid tests
test('valid input form fields', () => {
    const formData = { weight: 150, water: 4, steps: 10000, sleep: 8, exercise: 30, entryDate: '2024-10-01' };
    const result = validateDailyDataForm(formData);
    expect(result.isValid).toBe(true);
});
