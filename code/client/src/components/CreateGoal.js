import apiClient from "../services/apiClient.js";
import React, { useState } from "react";
import { validateGoalForm } from '../utils/validateGoalForm.js';

import {
  Box,
  Typography,
  TextField,
  Grid2,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button
} from "@mui/material";
import {
  box,
  title,
  inputLable,
  inputBackground,
  menuPropsStyles,
  submitButton,
} from "./style/styles.js";

function CreateGoal() {
  const [goalFormData, setGoalFormData] = useState({
    type: "",
    targetValue: 0,
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setGoalFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

// Function to handle the form submission event
const handleSubmit = (event) => {
  event.preventDefault(); // Prevent default form submission behavior (e.g., page reload)
  
  // Clear any existing messages before processing the form
  clearMessages();

  // Validate the form and, if valid, proceed with goal creation
  if (validateAndSetMessages(goalFormData)) {
    createGoal(goalFormData);
  }
};

// Function to clear any success or error messages
const clearMessages = () => {
  setSuccessMessage('');
  setErrorMessage('');
};

// Function to validate the goal form and handle validation messages
const validateAndSetMessages = (formData) => {
  const validationResult = validateGoalForm(formData);

  if (!validationResult.isValid) {
    setErrorMessage('Error: Please review your inputs and try again');
    return false; // Prevent form submission if validation fails
  }

  return true;
};

// Function to create a new goal by making a POST request
const createGoal = async (formData) => {
  try {
    console.log("Creating new goal with data:", formData);
    // Sends a POST request to the backend with the form data
    await apiClient.post("/create-goal", formData);
    handleGoalSuccess(); // Handle the success case
  } catch (error) {
    handleGoalError(error); // Handle the error case
  }
};

// Function to handle a successful goal creation
const handleGoalSuccess = () => {
  console.log("Goal created successfully!");
  setSuccessMessage('New goal successful!');
};

// Function to handle errors during goal creation
const handleGoalError = (error) => {
  console.error("Error creating goal:", error);
  setErrorMessage('Failed to create a new goal. Please try again.');
};


  return (
    <Box sx={box}>
      <Typography variant="h6" gutterBottom sx={title}>
        Set up your goal here:
      </Typography>
      {/* Set up your goal here:  */}
      <form onSubmit={handleSubmit}>
        <Grid2 container spacing={2}>
          {/*  Select a goal type */}
          <Grid2 item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel sx={inputLable}>Select a goal type</InputLabel>
              <Select
                data-testid="goal-type-select"
                name="type" // Add name to ensure proper handling
                value={goalFormData.type}
                onChange={handleChange}
                label="Select a goal type"
                sx={inputBackground}
                MenuProps={menuPropsStyles}
              >
                <MenuItem value="sleep">Sleep (Hours)</MenuItem>
                <MenuItem data-testid="goal-type-weight" value="weight">Weight (lbs)</MenuItem>
                <MenuItem value="steps">Steps (Step Count)</MenuItem>
                <MenuItem value="water">Water Intake (Glasses)</MenuItem>
                <MenuItem value="exercise">Exercise (Minutes)</MenuItem>
              </Select>
            </FormControl>
          </Grid2>
          {/* Target value */}
          <Grid2 item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                data-testid="goal-targetValue-select"
                type="number"
                name="targetValue"
                label="Target Value"
                value={goalFormData.targetValue}
                onChange={handleChange}
                required
                InputLabelProps={{
                  sx: inputLable,
                }}
                InputProps={{
                  sx: inputBackground,
                }}
                fullWidth
              />
            </FormControl>
          </Grid2>
          {/* Submit Button */}
          <Grid2 item xs={12}>
            <Button type="submit" variant="contained" sx={submitButton}>
              Submit
            </Button>
          </Grid2>
        </Grid2>
      </form>
      {errorMessage && <p style={{ color: '#E95D5C', fontWeight: "bold"}}>{errorMessage}</p>}
      {successMessage && <p style={{ color: '#008000', fontWeight: "bold" }}>{successMessage}</p>}
    </Box>
  );
}
export default CreateGoal;
