import { validateProfileForm } from '../utils/validateProfileForm'; 

test('empty input form fields', () => {
    const formData = { 
        name: '', gender: '',
        dob: { 
            year: 1990, 
            month: 1, 
            day: 1 
        }, 
        height: {
            feet: 0,
            inches: 0
        } };
    const result = validateProfileForm(formData);
    expect(result.isValid).toBe(false);
});

test('name contains invalid characters', () => {
    const formData = { 
        name: 'Test123', gender: 'female',
        dob: { 
            year: 1990, 
            month: 1, 
            day: 1 
        }, 
        height: {
            feet: 0,
            inches: 0
        } };
    const result = validateProfileForm(formData);
    expect(result.isValid).toBe(false);
});

test('dob year is outside of valid range', () => {
    const formData = { 
        name: 'Test Form', gender: 'female',
        dob: { 
            year: 2030, 
            month: 1, 
            day: 1 
        }, 
        height: {
            feet: 0,
            inches: 0
        } };
    const result = validateProfileForm(formData);
    expect(result.isValid).toBe(false);
});

test('height (feet) is outside of valid range', () => {
    const formData = { 
        name: 'Test Form', gender: 'female',
        dob: { 
            year: 1997, 
            month: 12, 
            day: 31 
        }, 
        height: {
            feet: 10,
            inches: 0
        } };
    const result = validateProfileForm(formData);
    expect(result.isValid).toBe(false);
});

test('height (inches) is outside of valid range', () => {
    const formData = { 
        name: 'Test Form', gender: 'female',
        dob: { 
            year: 1997, 
            month: 12, 
            day: 31 
        }, 
        height: {
            feet: 5,
            inches: -2
        } };
    const result = validateProfileForm(formData);
    expect(result.isValid).toBe(false);
});
