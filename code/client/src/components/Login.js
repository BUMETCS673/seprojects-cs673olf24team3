import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../services/apiClient.js";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import {
  Box,
  Typography,
  TextField,
  Grid2,
  FormControl,
  InputAdornment,
} from "@mui/material";
import { Button } from "@mui/material";
import {
  title,
  textField,
  loginBox,
  loginSubmitButton,
  link,
} from "./style/styles.js";

function Login() {
  // status to store login status
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false); // set password visibility
  const [error, setError] = useState("");

  const navigate = useNavigate();
  // update input values
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prevShow) => !prevShow);
  };

  // form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    // setSuccess('');
    try {
      const response = await apiClient.post("/login", formData);
      // store token
      localStorage.setItem("authToken", response.data.token);
      // redirect to home page
      //console.log('login success:', response.data);
      navigate("/");
    } catch (error) {
      //console.error('login error:', error);
      // warn user
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("Invalid email or password.");
      }
    }
  };

  return (
    <Box sx={loginBox}>
      <Typography variant="h6" gutterBottom sx={title}>
        Sign in Here!
      </Typography>
      <form className="login-form" onSubmit={handleSubmit}>
        {/* Display error message if necessary */}
        {error && <p className="error-message">{error}</p>}

        <Grid2 container direction="column" spacing={2}>
          {/* Email -------------------------------------*/}
          <Grid2 item xs={6}>
            <FormControl fullWidth>
              <TextField
                label="Email"
                variant="filled"
                fullWidth
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                sx={textField}
              />
            </FormControl>
          </Grid2>
          {/* Password ----------------------------------*/}
          <Grid2 item xs={6}>
            <FormControl fullWidth>
              <TextField
                label="Password"
                variant="filled"
                fullWidth
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        onClick={togglePasswordVisibility}
                        aria-label={
                          showPassword ? "hide password" : "show password"
                        }
                        sx={{
                          color: "#F4F4F4",
                        }}
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </Button>
                    </InputAdornment>
                  ),
                }}
                sx={textField}
              />
            </FormControl>
          </Grid2>

          {/* login button ------------------------------*/}
          <Grid2 item xs={12} container justifyContent="center">
            <Button type="submit" variant="contained" sx={loginSubmitButton}>
              Sign in ➜
            </Button>
          </Grid2>
        </Grid2>
      </form>
      Not a member?{" "}
      <Link to="/create-user" style={link}>
        Create an account
      </Link>
    </Box>
  );
}

export default Login;
