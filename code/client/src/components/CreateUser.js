import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/apiClient.js";
import { validateRegistrationForm } from "../utils/validateRegistrationForm.js";

import {
  Box,
  Typography,
  TextField,
  Grid,
  FormControl,
  Button,
} from "@mui/material";
import {
  title,
  loginSubmitButton,
  signUpBox,
  signUptextField,
} from "./style/styles.js";

function CreateUser() {
  const navigate = useNavigate(); // Initialize the hook

  // State for form input values
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Handle input changes and update formData state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior (e.g. page reload)

    setSuccessMessage("");
    setErrorMessage("");

    // Validate form inputs
    const validationResult = validateRegistrationForm(formData);
    if (!validationResult) {
      setErrorMessage("Error: Please review your inputs and try again");
      return; // Prevent form submission
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

  return (
    <Box sx={signUpBox}>
      <Typography variant="h6" gutterBottom sx={title}>
        Sign up
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container direction="column" spacing={2}>
          {/* Name (First & Last) -------------------------------------*/}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                data-testid="txtName"
                label="Name (First & Last)"
                variant="filled"
                fullWidth
                name="name"
                value={formData.name}
                onChange={handleChange}
                sx={signUptextField}
              />
            </FormControl>
          </Grid>
          {/* Email -------------------------------------*/}
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <TextField
                data-testid="txtEmail"
                label="Email"
                variant="filled"
                fullWidth
                name="email"
                value={formData.email}
                onChange={handleChange}
                sx={signUptextField}
              />
            </FormControl>
          </Grid>
          {/* Password -------------------------------------*/}
          <Grid item xs={12} md={3}>
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
                sx={signUptextField}
              />
            </FormControl>
          </Grid>
          {/* Submit Button -------------------------------------*/}
          <Grid item xs={12} container justifyContent="center">
            <Button type="submit" variant="contained" sx={loginSubmitButton}>
              Sign Up
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

export default CreateUser;
