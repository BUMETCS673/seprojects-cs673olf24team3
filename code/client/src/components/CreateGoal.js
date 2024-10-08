import React, { useState, useEffect } from "react"; // Added useEffect import
import apiClient from "../services/apiClient.js";
import { validateGoalForm } from "../utils/validateGoalForm.js";
import { authenticated } from "../utils/authenticate.js";
import {
  Box,
  Typography,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
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
  // Profile Data State
  const [profileData, setProfileData] = useState({
    userId: "",
    email: "",
    name: "",
    gender: "",
    dob: { year: 1900, month: 1, day: 1 },
    height: { feet: "", inches: "" },
  });

  const [goalFormData, setGoalFormData] = useState({
    type: "",
    targetValue: 0,
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(null); // State for managing error when fetching profile

  // useEffect to fetch profile data
  useEffect(() => {
    const token = authenticated();

    if (token) {
      apiClient
        .get("/api/users/manage-profile", {
          headers: { Authorization: `Bearer ${token}` },
        }) // Fetch user profile data from the backend
        .then((res) => {
          setProfileData(res.data); // Set the fetched profile data
        })
        .catch((err) => {
          setError("Error fetching profile data. Try refreshing.");
          console.log(err);
        });
    }
  }, []); // Empty dependency array to run only once after the component mounts

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
    event.preventDefault(); // Prevent default form submission behavior
    clearMessages();

    if (validateAndSetMessages(goalFormData)) {
      createGoal(goalFormData);
    }
  };

  // Clear messages
  const clearMessages = () => {
    setSuccessMessage("");
    setErrorMessage("");
  };

  // Validate form
  const validateAndSetMessages = (formData) => {
    const validationResult = validateGoalForm(formData);
    if (!validationResult.isValid) {
      setErrorMessage(validationResult.message);
      return false;
    }
    return true;
  };

  // Create goal
  const createGoal = async (formData) => {
    try {
      console.log("Creating new goal with data:", formData);

      const token = authenticated();
      console.log("Token:", token);

      await apiClient.post("/api/goals/create-goal", formData, {
        headers: { Authorization: `Bearer ${token}` }, // Pass token
      });

      handleGoalSuccess();
    } catch (error) {
      handleGoalError(error);
    }
  };

  // Handle success
  const handleGoalSuccess = () => {
    console.log("Goal created successfully!");
    setSuccessMessage("New goal successful!");
  };

  // Handle error
  const handleGoalError = (error) => {
    console.error("Error creating goal:", error);
    setErrorMessage("Failed to create a new goal. Please try again.");
  };

  return (
    <Box sx={box}>
      <Typography variant="h6" gutterBottom sx={title}>
        Set up your goal here:
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Select a goal type */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel sx={inputLable}>Select a goal type</InputLabel>
              <Select
                data-testid="goal-type-select"
                name="type"
                value={goalFormData.type}
                onChange={handleChange}
                label="Select a goal type"
                sx={inputBackground}
                MenuProps={menuPropsStyles}
              >
                <MenuItem value="sleep">Sleep (Hours)</MenuItem>
                <MenuItem data-testid="goal-type-weight" value="weight">
                  Weight (lbs)
                </MenuItem>
                <MenuItem value="steps">Steps (Step Count)</MenuItem>
                <MenuItem value="water">Water Intake (Glasses)</MenuItem>
                <MenuItem value="exercise">Exercise (Minutes)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {/* Target value */}
          <Grid item xs={12} md={6}>
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
          </Grid>
          {/* Submit Button */}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" sx={submitButton}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
      {errorMessage && (
        <p style={{ color: "#E95D5C", fontWeight: "bold" }}>{errorMessage}</p>
      )}
      {successMessage && (
        <p style={{ color: "#008000", fontWeight: "bold" }}>{successMessage}</p>
      )}
    </Box>
  );
}

export default CreateGoal;
