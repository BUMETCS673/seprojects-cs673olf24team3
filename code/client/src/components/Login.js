import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import apiClient from '../services/apiClient.js';
import './css/Login.css';
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

// import './css/Login.css';
import {
  Box,
  Typography,
  TextField,
  Grid,
  Slider,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { Button } from "@mui/material";

function Login() {
  // status to store login status
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);// set password visibility
  const [error, setError] = useState(''); 

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
    setError('');
    // setSuccess('');
    try {
      const response = await apiClient.post("/login", formData);
      // store token
      localStorage.setItem("authToken", response.data.token);
      // redirect to home page
      //console.log('login success:', response.data);
      navigate('/');
    } catch (error) {
      //console.error('login error:', error);
      // warn user
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Invalid email or password.');
      }
    }
  };

  return (
    <Box
      sx={{
        width: "80%",
        display: "flex",
        justifyContent: "center",
        padding: "2%",
        borderRadius: "10px",
        height: "calc(100vh - 8rem)",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {/* <div className="login-container"> */}
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
        Sign in Here!
      </Typography>
      <form className="login-form" onSubmit={handleSubmit}>

      {/* <h2>Welcome !</h2> */}
      
      {/* Display error message if necessary */}
      {/* {error && <p className="error-message">{error}</p>} */}

        <Grid container direction="column" spacing={2}>
          {/* Email -------------------------------------*/}
          <Grid item xs={6}>
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
          {/* Password ----------------------------------*/}
          {/* <label htmlFor="password">Password:</label>
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="password-toggle-button"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "hide password" : "show password"}
            >
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </button>
          </div> */}
          <Grid item xs={6}>
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
                sx={{
                  backgroundColor: "#5E5E5E",
                  borderRadius: "10px",
                  "& .MuiInputBase-input": {
                    color: "#F4F4F4", // input text color
                  },
                  "& .MuiInputLabel-root": {
                    color: "#CACACA", // label color
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#F8DEBD", // focused label color
                  },
                  "& .MuiFilledInput-underline:before": {
                    borderBottom: "none", // no underline when unfocused
                  },
                  "& .MuiFilledInput-underline:after": {
                    borderBottomColor: "#F8DEBD", // underline color when focused
                  },
                }}
              />
            </FormControl>
          </Grid>

          {/* login button ------------------------------*/}
          <Grid item xs={12} container justifyContent="center">
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#3A3A3A",
                color: "#CACACA",
                borderRadius: "10px",
                padding: "2% 24%",
                "&:hover": {
                  backgroundColor: "#F8DEBD",
                  color: "#303030",
                },
              }}
            >
              Sign in ➜
            </Button>
          </Grid>
          {/* <button type="submit">Login</button> */}
        </Grid>
      </form>
      {/* </div> */}
    </Box>
  );
}

export default Login;
