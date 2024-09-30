import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient.js';
import { validateRegistrationForm } from '../utils/validateRegistrationForm.js';

import {
  Box,
  Typography,
  TextField,
  Grid,
  FormControl,
  Button
} from "@mui/material";

function CreateUser() {
  const navigate = useNavigate(); // Initialize the hook

  // State for form input values
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [validationMessage, setValidationMessage] = useState('');

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

    setSuccessMessage('');
    setErrorMessage('');
    setValidationMessage('');

    // Validate form inputs
    const validationResult = validateRegistrationForm(formData);
    if (!validationResult) {
      setValidationMessage('Error: Please review your inputs and try again');
      return; // Prevent form submission
    }
    
    try {
      await apiClient.post('/create-user', formData);
      setSuccessMessage('Registration successful! Redirecting to the login page...');

      setFormData({
        name: '',
        email: '',
        password: '',
      });
      
      // Delay routing to the login page to allow the success message to be visible
      setTimeout(() => {
        navigate('/login');
      }, 2000); // 2 second delay


    } catch (error) {
      // console.error('Error creating user:', error);
      setErrorMessage('Registration failed. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        top: "4rem",
        right: 0,
        bottom: 0,
        width: "80%",
        padding: "2%",
        borderRadius: "10px",
        height: "calc(100vh - 4rem)",
        overflowY: "auto",
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          marginTop: "4%",
          marginBottom: "2%",
          color: "#5B5753",
          fontSize: "1.4rem",
          fontWeight: "600",
        }}
      >
        Sign up
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Name (First & Last) -------------------------------------*/}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                label="Name (First & Last)"
                variant="filled"
                fullWidth
                name="name"
                value={formData.name}
                onChange={handleChange}
                sx={{
                  backgroundColor: "#5E5E5E",
                  borderRadius: "10px",
                  "& .MuiInputBase-input": {
                    color: "#F4F4F4", // input color
                  },
                  "& .MuiInputLabel-root": {
                    color: "#CACACA", // label color
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#F8DEBD", // focused label color
                  },
                  "& .MuiFilledInput-underline:before": {
                    borderBottom: "none", // no underline when unfocuced
                  },
                  "& .MuiFilledInput-underline:after": {
                    borderBottomColor: "#F8DEBD", // underline color when focuced
                  },
                  "& .MuiInputAdornment-root": {
                    color: "#F4F4F4", // hour color
                  },
                }}
              />
            </FormControl>
          </Grid>
          {/* Email -------------------------------------*/}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                label="Email"
                variant="filled"
                fullWidth
                name="email"
                value={formData.email}
                onChange={handleChange}
                sx={{
                  backgroundColor: "#5E5E5E",
                  borderRadius: "10px",
                  "& .MuiInputBase-input": {
                    color: "#F4F4F4", // input color
                  },
                  "& .MuiInputLabel-root": {
                    color: "#CACACA", // label color
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#F8DEBD", // focused label color
                  },
                  "& .MuiFilledInput-underline:before": {
                    borderBottom: "none", // no underline when unfocuced
                  },
                  "& .MuiFilledInput-underline:after": {
                    borderBottomColor: "#F8DEBD", // underline color when focuced
                  },
                  "& .MuiInputAdornment-root": {
                    color: "#F4F4F4", // hour color
                  },
                }}
              />
            </FormControl>
          </Grid>
          {/* Password -------------------------------------*/}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                label="Password"
                variant="filled"
                fullWidth
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                sx={{
                  backgroundColor: "#5E5E5E",
                  borderRadius: "10px",
                  "& .MuiInputBase-input": {
                    color: "#F4F4F4", // input color
                  },
                  "& .MuiInputLabel-root": {
                    color: "#CACACA", // label color
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#F8DEBD", // focused label color
                  },
                  "& .MuiFilledInput-underline:before": {
                    borderBottom: "none", // no underline when unfocuced
                  },
                  "& .MuiFilledInput-underline:after": {
                    borderBottomColor: "#F8DEBD", // underline color when focuced
                  },
                  "& .MuiInputAdornment-root": {
                    color: "#F4F4F4", // hour color
                  },
                }}
              />
            </FormControl>
          </Grid>
          {/* Submit Button -------------------------------------*/}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#3A3A3A",
                color: "#CACACA",
                borderRadius: "10px",
                padding: "1% 4%",
                "&:hover": {
                  backgroundColor: "#F8DEBD",
                  color: "#303030",
                },
              }}
            >
              Sign Up
            </Button>
          </Grid>
        </Grid>
      </form>
      {validationMessage && <p style={{ color: '#E95D5C', fontWeight: "bold"}}>{validationMessage}</p>}
      {successMessage && <p style={{ color: '#008000', fontWeight: "bold" }}>{successMessage}</p>}
    </Box>
  );
}

export default CreateUser;
