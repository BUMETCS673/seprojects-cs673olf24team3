import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/apiClient.js";
import { validateRegistrationForm } from "../utils/validateRegistrationForm.js";
import zxcvbn from "zxcvbn";  // Import zxcvbn for password strength analysis

import {
  Box,
  Typography,
  TextField,
  Grid2,
  FormControl,
  Button,
  LinearProgress,
} from "@mui/material";
import {
  title,
  loginSubmitButton,
  loginBox,
  textField,
} from "./style/styles.js";

function CreateUser() {
  const navigate = useNavigate(); // Initialize the hook

  // State for form input values
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",  // Add a field for confirming the password
  });
  
  const [passwordStrength, setPasswordStrength] = useState(0);  // State for password strength
  const [passwordFeedback, setPasswordFeedback] = useState(""); // State for password feedback
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);  // State to track if passwords match

  // Handle input changes and update formData state
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Set formData with the updated value
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Analyze password strength when user types in the password field
    if (name === "password") {
      const result = zxcvbn(value);
      setPasswordStrength(result.score);  // Score ranges from 0 to 4

      // Update feedback based on strength level
      if (result.score >= 2) {
        setPasswordFeedback("Password is valid and strong enough.");
      } else {
        setPasswordFeedback(result.feedback.suggestions.join(" ") || "Password is too weak.");
      }
    }

    // Check if passwords match
    if (name === "confirmPassword" || name === "password") {
      // Use value directly in the comparison for real-time check
      setPasswordsMatch(
        name === "password"
          ? value === formData.confirmPassword
          : formData.password === value
      );
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior (e.g., page reload)

    setSuccessMessage("");
    setErrorMessage("");

    // Ensure the password strength is at least 2 (Fair)
    if (passwordStrength < 2) {
      setErrorMessage("Password strength must be at least 'Fair' (score of 2 or higher).");
      return;  // Prevent form submission if password is too weak
    }

    // Ensure the passwords match
    if (!passwordsMatch) {
      setErrorMessage("Passwords do not match.");
      return;  // Prevent form submission if passwords do not match
    }

    // Validate form inputs
    const validationResult = validateRegistrationForm(formData);
    if (!validationResult) {
      setErrorMessage("Error: Please review your inputs and try again");
      return;  // Prevent form submission
    }

    try {
      await apiClient.post("/api/users/create-user", formData);
      setSuccessMessage(
        "Registration successful! Redirecting to the login page..."
      );

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",  // Reset the confirmPassword field as well
      });

      // Delay routing to the login page to allow the success message to be visible
      setTimeout(() => {
        navigate("/login");
      }, 2000); // 2 second delay
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.message); // Set the error message from server response
      } else {
        setErrorMessage("Registration failed. Please try again.");
      }
    }
  };

  // Get password strength label
  const getStrengthLabel = (score) => {
    switch (score) {
      case 0: return "Very Weak";
      case 1: return "Weak";
      case 2: return "Fair";
      case 3: return "Good";
      case 4: return "Strong";
      default: return "";
    }
  };

  // Dynamically set color for progress bar
  const getProgressColor = () => {
    switch (passwordStrength) {
      case 0: return "#ff1744";  // Red (Very Weak)
      case 1: return "#ff9100";  // Orange (Weak)
      case 2: return "#ffc400";  // Yellow (Fair)
      case 3: return "#00e676";  // Light Green (Good)
      case 4: return "#00c853";  // Green (Strong)
      default: return "#e0e0e0";  // Default Grey
    }
  };

  return (
    <Box sx={loginBox}>
      <Typography variant="h6" gutterBottom sx={title}>
        Sign up
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid2 container direction="column" spacing={2}>
          {/* Name (First & Last) -------------------------------------*/}
          <Grid2 item size={{ xs: 12 }}>
            <FormControl fullWidth>
              <TextField
                data-testid="txtName"
                label="Name (First & Last)"
                variant="filled"
                fullWidth
                name="name"
                value={formData.name}
                onChange={handleChange}
                sx={textField}
              />
            </FormControl>
          </Grid2>
          {/* Email -------------------------------------*/}
          <Grid2 item size={{ xs: 12 }}>
            <FormControl fullWidth>
              <TextField
                data-testid="txtEmail"
                label="Email"
                variant="filled"
                fullWidth
                name="email"
                value={formData.email}
                onChange={handleChange}
                sx={textField}
              />
            </FormControl>
          </Grid2>
          {/* Password -------------------------------------*/}
          <Grid2 item size={{ xs: 12 }}>
            <FormControl fullWidth>
              <TextField
                data-testid="txtPassword"
                label="Password"
                variant="filled"
                fullWidth
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                sx={textField}
              />
            </FormControl>
          </Grid2>

          {/* Confirm Password -------------------------------------*/}
          <Grid2 item size={{ xs: 12 }}>
          <FormControl fullWidth>
            <TextField
              data-testid="txtConfirmPassword"
              label="Confirm Password"
              variant="filled"
              fullWidth
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              sx={textField}
              InputProps={{
                sx: {
                  '& .MuiFilledInput-root': {
                    backgroundColor: '#424242', // Dark gray background color for the filled variant
                    '&:hover': {
                      backgroundColor: '#424242', // Keep dark gray on hover
                    },
                    '&.Mui-focused': {
                      backgroundColor: '#424242', // Keep dark gray when focused
                    },
                  },
                },
              }}
            />
          </FormControl>

            {!passwordsMatch && (
              <Typography variant="body2" color="error">
                Passwords do not match.
              </Typography>
            )}
          </Grid2>

          {/* Password Strength Meter */}
          <Grid2 item xs={12}>
            <LinearProgress
              variant="determinate"
              value={(passwordStrength / 4) * 100}  // Convert score to percentage (0-100)
              sx={{
                height: "10px",
                borderRadius: "5px",
                marginBottom: "10px",
                backgroundColor: "#e0e0e0",  // Grey background for the progress bar
                "& .MuiLinearProgress-bar": {
                  backgroundColor: getProgressColor(),  // Dynamic color for the progress bar
                },
              }}
            />
            <Typography variant="body2">
              Password Strength: {getStrengthLabel(passwordStrength)}
            </Typography>

            {/* Feedback Element with Wrapping */}
            {passwordFeedback && (
              <Typography
                variant="body2"
                color={passwordStrength >= 2 ? "success.main" : "error"} // Green feedback if strong enough
                sx={{
                  maxWidth: "200px",      // Limit the width to 400px (adjustable)
                  maxHeight: "60px",      // Limit the height to 60px (adjustable)
                  overflow: "hidden",     // Hide overflow if it exceeds the height
                  textOverflow: "ellipsis", // Add ellipsis if text overflows
                  wordWrap: "break-word", // Ensure words break properly
                  whiteSpace: "normal",   // Enable text wrapping
                }}
              >
                {passwordFeedback}
              </Typography>
            )}
          </Grid2>

          {/* Submit Button -------------------------------------*/}
          <Grid2 item size={{ xs: 12 }} container justifyContent="center">
            <Button
              type="submit"
              variant="contained"
              sx={loginSubmitButton}
              disabled={passwordStrength < 2 || !passwordsMatch} // Disable button if password is weak or passwords don't match
            >
              Sign Up
            </Button>
          </Grid2>
        </Grid2>
      </form>

      {/* Error & Success Messages */}
      {errorMessage && (
        <p style={{ color: "#E95D5C", fontWeight: "bold" }}>{errorMessage}</p>
      )}
      {successMessage && (
        <p style={{ color: "#008000", fontWeight: "bold" }}>{successMessage}</p>
      )}
    </Box>
  );
}

export default CreateUser;