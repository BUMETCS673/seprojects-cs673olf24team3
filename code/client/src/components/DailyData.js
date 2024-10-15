import React, { useState, useRef, useEffect } from "react";
import apiClient from "../services/apiClient.js";
import { authenticated } from "../utils/authenticate.js";
import {
  Box,
  Typography,
  TextField,
  Grid2,
  FormControl,
  InputAdornment,
  Collapse,
  Paper,
  Button,
} from "@mui/material";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import {
  box,
  title,
  textField,
  inputLabel,
  inputBackground,
  submitButton,
  datePick,
  calendarStyle,
} from "./style/styles.js";
import { validateDailyDataForm } from "../utils/validateDailyDataForm.js";

function DailyData() {
  const token = authenticated()

  const [formData, setFormData] = useState({
    weight: "",
    steps: "",
    sleep: "",
    water: "",
    exercise: "",
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

  // date
  const [date, setDate] = useState(null); //

  const [anchorEl, setAnchorEl] = useState(null); // control Popper content
  const [open, setOpen] = useState(false); // control Popper open/close

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    setOpen(false); // close after chosing date
  };

  const handleTextFieldClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((prevOpen) => !prevOpen); // open/close calendar
  };

  const formatDate = (date) => {
    return date ? date.toLocaleDateString("en-CA") : "";
  };

  const calendarRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setOpen(false); // Close the calendar if clicked outside
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior (e.g., page reload)

    // Clear any existing messages before processing the form
    setSuccessMessage("");
    setErrorMessage("");

    const updatedFormData = {
      ...formData, // Include all the existing form data (weight, steps, sleep, etc.)
      entryDate: date ? formatDate(date) : null, // Add the selected date
    };

    // Validate form inputs
    const validationResult = validateDailyDataForm(updatedFormData);
    if (!validationResult.isValid) {
      setErrorMessage(validationResult.message);
      return; // Prevent form submission
    }

    try {
      if (token) {
        await apiClient.post(
          "/api/daily-entry/enter-daily-data",
          updatedFormData,
          {
            headers: { Authorization: `Bearer ${token}` }, // Pass token
          }
        );
        setSuccessMessage("Daily entry successful!");
      }
    } catch (err) {
      setErrorMessage("Error: Failed to submit daily entry. Please try again");
    }
  };

  return (
    <Box sx={box}>
      <Typography variant="h6" gutterBottom sx={title}>
        Enter your data for the day:
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Select a date"
          value={formatDate(date)}
          onClick={handleTextFieldClick}
          required
          readOnly
          variant="filled"
          sx={datePick}
          fullWidth
        />

        <Collapse in={open}>
          <Paper ref={calendarRef} sx={calendarStyle}>
            <DayPicker
              mode="single"
              selected={date}
              onSelect={handleDateChange}
              styles={{
                month: {
                  backgroundColor: "#C2D5C0",
                  padding: "1rem",
                  borderRadius: "20px",
                },
              }}
            />
          </Paper>
        </Collapse>

        <Grid2 container spacing={2}>
          {/* Weight */}
          <Grid2 item size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Weight"
              variant="filled"
              fullWidth
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Box component="span" sx={{ color: "#F4F4F4" }}>
                      lb
                    </Box>
                  </InputAdornment>
                ),
              }}
              sx={textField}
            />
          </Grid2>
          {/* Steps Count */}
          <Grid2 item size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Count"
              variant="filled"
              fullWidth
              name="steps"
              value={formData.steps}
              onChange={handleChange}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Box component="span" sx={{ color: "#F4F4F4" }}>
                      Steps
                    </Box>
                  </InputAdornment>
                ),
              }}
              sx={textField}
            />
          </Grid2>
          {/* Sleep hour */}
          <Grid2 item size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Sleep"
              variant="filled"
              fullWidth
              name="sleep"
              value={formData.sleep}
              onChange={handleChange}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Box component="span" sx={{ color: "#F4F4F4" }}>
                      hour
                    </Box>
                  </InputAdornment>
                ),
              }}
              sx={textField}
            />
          </Grid2>

          {/* water */}
          <Grid2 item size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Water"
              variant="filled"
              fullWidth
              name="water"
              value={formData.water}
              onChange={handleChange}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Box component="span" sx={{ color: "#F4F4F4" }}>
                      glass
                    </Box>
                  </InputAdornment>
                ),
              }}
              sx={textField}
            />
          </Grid2>

          {/* How long did you exercise */}
          <Grid2 item size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <TextField
                data-testid="exerciseTime"
                type="number"
                name="exercise"
                label="How long did you exercise - min"
                value={formData.exercise}
                onChange={handleChange}
                required
                InputLabelProps={{
                  sx: inputLabel,
                }}
                InputProps={{
                  sx: inputBackground,
                }}
                variant="outlined"
                fullWidth
              />
            </FormControl>
          </Grid2>

          {/* Submit Button */}
          <Grid2 item size={{ xs: 12 }}>
            <Button type="submit" variant="contained" sx={submitButton}>
              Submit
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

export default DailyData;
