import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/apiClient.js";
import { validateRegistrationForm } from "../utils/validateRegistrationForm.js";

import {
  Box,
  Typography,
  TextField,
  Grid2,
  FormControl,
  Button,
} from "@mui/material";
import {
  box,
  title,
  textField,
  submitButton,
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
      await apiClient.post("/create-user", formData);
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
    <Box sx={box}>
      <Typography variant="h6" gutterBottom sx={title}>
        Sign up
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid2 container spacing={2}>
          {/* Name (First & Last) -------------------------------------*/}
          <Grid2 item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
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
          <Grid2 item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
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
          <Grid2 item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
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
          {/* Submit Button -------------------------------------*/}
          <Grid2 item xs={12}>
            <Button type="submit" variant="contained" sx={submitButton}>
              Sign Up
            </Button>
          </Grid2>
        </Grid2>
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
