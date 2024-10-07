import React, { useState, useEffect } from "react"; // Added useEffect import
import apiClient from "../services/apiClient.js";
import { validateGoalForm } from '../utils/validateGoalForm.js';
import { authenticated } from "../utils/authenticate.js";
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
  bigTitle,
  inputLable,
  inputBackground,
  menuPropsStyles,
  submitButton,
} from "./style/styles.js";

function ManageGoal() {
  // Profile Data State
  const [goalData, setGoalData] = useState({
    sleepHours: "",
    weightLbs: "",
    stepsCounts: "",
    waterIntakeGlasses: "",
    exerciseMinutes: ""
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // useEffect to fetch profile data
  useEffect(() => {
    const token = authenticated();

    if (token) {
      apiClient
        .get("/api/goals/create-goal", {
          headers: { Authorization: `Bearer ${token}` },
        }) // Fetch user profile data from the backend
        .then((res) => {
          setGoalData(res.data); // Set the fetched profile data
        })
        .catch((err) => {
          setError("Error fetching goal data. Try refreshing.");
          console.log(err);
        });
    }
  }, []); // Empty dependency array to run only once after the component mounts

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setGoalData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to handle the form submission event
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    
    setSuccessMessage('');
    setErrorMessage('');

    const validationResult = validateGoalForm(goalData);
    if (!validationResult.isValid) {
      setErrorMessage(validationResult.message);
      return;
    }
  

  try {
    const token = authenticated();
    await apiClient.post("/api/goals/create-goal", goalData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Updating goal");
    setSuccessMessage('Goal updated!');
    } catch (err) {
      console.log("Error updating goal", err);
      setErrorMessage('Error: Failed to update goal. Please try again');
    }
  };

  return (
    <Box sx={box}>
      <Typography variant="h6" gutterBottom sx={bigTitle}>
        Manage Goal
      </Typography>
      {error ? (
        <p>{error}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <TextField
            label="Weight (lbs)"
            name="weightLbs"
            value={goalData.weightLbs}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="number"
            sx={inputBackground}
            InputProps={{ inputProps: { min: 0 } }}
          />
          <TextField
            label="Steps (counts)"
            name="stepsCounts"
            value={goalData.stepsCounts}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="number"
            sx={inputBackground}
            InputProps={{ inputProps: { min: 0 } }}
          />
          <TextField
            label="Sleep (Hours)"
            name="sleepHours"
            value={goalData.sleepHours}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="number"
            sx={inputBackground}
            InputProps={{ inputProps: { min: 0, max: 24 } }}
          />
          
          
          <TextField
            label="Water Intake (glasses)"
            name="waterIntakeGlasses"
            value={goalData.waterIntakeGlasses}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="number"
            sx={inputBackground}
            InputProps={{ inputProps: { min: 0 } }}
          />
          <TextField
            label="Exercise (minutes)"
            name="exerciseMinutes"
            value={goalData.exerciseMinutes}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="number"
            sx={inputBackground}
            InputProps={{ inputProps: { min: 0 } }}
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={submitButton}
          >
            Update Goal
          </Button>
        </form>
      )}
      {errorMessage && <p style={{ color: '#E95D5C', fontWeight: "bold" }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: '#008000', fontWeight: "bold" }}>{successMessage}</p>}
    </Box>
  );
}

export default ManageGoal;