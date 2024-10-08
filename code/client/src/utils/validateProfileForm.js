export function validateProfileForm(formData) {
    const { name, gender, dob, height } = formData;

    // Checking there is input data in each field
    if (!name || !gender || !dob || !height) {
        return { isValid: false, message: 'Form field(s) missing' };
    }

    // Checking validity of name - con only contain alphabet or hyphens
    if (!/^[A-Za-z-\s]+$/.test(name)) {
        return { isValid: false, message: 'Name contains invalid characters. Only alphabetic characters, hyphens, and spaces allowed.' };
    }

    // Checking validity of DOB year input
    if (dob.year < 1900 || dob.year > 2024) {
        return { isValid: false, message: 'DOB year not in valid range. Must be between 1900 and 2024.' };
    }

    // Checking validity of height inputs
    if (height.feet < 0 || height.feet > 7) {
        return { isValid: false, message: 'Height (feet) not in valid range. Must be between 0 and 7.' };
    }

    if (height.inches < 0 || height.inches > 12) {
        return { isValid: false, message: 'Height (inches) not in valid range. Must be between 0 and 12.' };
    }

    // If all validations pass
    return { isValid: true, message: 'Form is valid' };
}
