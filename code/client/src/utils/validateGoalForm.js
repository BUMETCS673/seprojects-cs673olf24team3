export function validateGoalForm(formData) {
    const { sleepHours, weightLbs, stepsCounts, waterIntakeGlasses, exerciseMinutes } = formData;


    if(
        sleepHours === "" ||
        weightLbs === "" ||
        stepsCounts === "" ||
        waterIntakeGlasses === "" ||
        exerciseMinutes === ""
      )
      {
        return { isValid: false, message: 'Form field(s) missing' };
    }  
    if (isNaN(sleepHours) || sleepHours < 0 || sleepHours > 24) {
      return { isValid: false, message: 'Sleep hours must be a number between 0 and 24' };
    }
  
    if (isNaN(weightLbs) || weightLbs <= 0) {
      return { isValid: false, message: 'Weight must be a positive number' };
    }
  
    if (isNaN(stepsCounts) || stepsCounts < 0) {
      return { isValid: false, message: 'Steps cannot be negative' };
    }
  
    if (isNaN(waterIntakeGlasses) || waterIntakeGlasses < 0) {
      return { isValid: false, message: 'Water intake cannot be negative' };
    }
  
    if (isNaN(exerciseMinutes) || exerciseMinutes < 0) {
      return { isValid: false, message: 'Exercise minutes cannot be negative' };
    }

    return { isValid: true, message: 'Form is valid' };

  
}