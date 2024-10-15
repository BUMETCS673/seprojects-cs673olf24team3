import React, { useState, useEffect } from "react";
import apiClient from "../services/apiClient.js";
import { validateGoalForm } from "../utils/validateGoalForm.js";
import { authenticated } from "../utils/authenticate.js";
import { Box, Typography, TextField, Button, Grid2 } from "@mui/material";
import {
  box,
  bigTitle,
  submitButton,
  inputLabel2,
  textField,
} from "./style/styles.js";

function ManageGoal() {
  // Profile Data State
  const [goalData, setGoalData] = useState({
    sleepHours: "",
    weightLbs: "",
    stepsCounts: "",
    waterIntakeGlasses: "",
    exerciseMinutes: "",
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchGoalData = () => {
    const token = authenticated();

    if (token) {
      apiClient
        .get("/api/goals", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setGoalData(res.data);
        })
        .catch((err) => {
          setError("Error fetching goal data. Try refreshing.");
        });
    }
  };

  // useEffect to fetch profile data
  useEffect(() => {
    fetchGoalData();
  }, []);

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

    setSuccessMessage("");
    setErrorMessage("");

    const validationResult = validateGoalForm(goalData);
    if (!validationResult.isValid) {
      setErrorMessage(validationResult.message);
      return;
    }

    try {
      const token = authenticated();
      await apiClient.post("/api/goals", goalData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMessage("Goal updated!");
      fetchGoalData();
    } catch (err) {
      setErrorMessage("Error: Failed to update goal. Please try again");
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
          <Grid2 container spacing={2}>
            {/* Weight */}
            <Grid2 item size={{ xs: 12, sm: 12 }}>
              <TextField
                label="Weight (lbs)"
                name="weightLbs"
                value={goalData.weightLbs}
                onChange={handleChange}
                fullWidth
                margin="normal"
                type="number"
                sx={{
                  ...textField,
                  ...inputLabel2,
                }}
              />
            </Grid2>
            <Grid2 item size={{ xs: 12, sm: 12 }}>
              <TextField
                label="Steps (counts)"
                name="stepsCounts"
                value={goalData.stepsCounts}
                onChange={handleChange}
                fullWidth
                margin="normal"
                type="number"
                sx={{
                  ...textField,
                  ...inputLabel2,
                }}
              />
            </Grid2>
            <Grid2 item size={{ xs: 12, sm: 12 }}>
              <TextField
                label="Sleep (Hours)"
                name="sleepHours"
                value={goalData.sleepHours}
                onChange={handleChange}
                fullWidth
                margin="normal"
                type="number"
                sx={{
                  ...textField,
                  ...inputLabel2,
                }}
              />
            </Grid2>
            <Grid2 item size={{ xs: 12, sm: 12 }}>
              <TextField
                label="Water Intake (glasses)"
                name="waterIntakeGlasses"
                value={goalData.waterIntakeGlasses}
                onChange={handleChange}
                fullWidth
                margin="normal"
                type="number"
                sx={{
                  ...textField,
                  ...inputLabel2,
                }}
              />
            </Grid2>
            <Grid2 item size={{ xs: 12, sm: 12 }}>
              <TextField
                label="Exercise (minutes)"
                name="exerciseMinutes"
                value={goalData.exerciseMinutes}
                onChange={handleChange}
                fullWidth
                margin="normal"
                type="number"
                sx={{
                  ...textField,
                  ...inputLabel2,
                }}
              />
            </Grid2>
          </Grid2>
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
      {errorMessage && (
        <p style={{ color: "#E95D5C", fontWeight: "bold" }}>{errorMessage}</p>
      )}
      {successMessage && (
        <p style={{ color: "#008000", fontWeight: "bold" }}>{successMessage}</p>
      )}
    </Box>
  );
}

export default ManageGoal;
