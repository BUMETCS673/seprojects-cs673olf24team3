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
  inputLable,
  inputBackground,
  menuPropsStyles,
  submitButton,
  sideMenuBox,
  sideMenuTitle,
  datePick,
  calendarStyle,
} from "./style/styles.js";

function DailyData() {
  const [formData, setFormData] = useState({
    // entryDate: "",
    weight: "",
    steps: "",
    sleep: "",
    water: "",
    exercise: "",
  });

  // Handle input changes and update formData state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // const [mood, setMood] = useState(3);
  // const [breakfast, setBreakfast] = useState("");
  // const [lunch, setLunch] = useState("");
  // const [dinner, setDinner] = useState("");

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

  // const handleMoodChange = (event, newValue) => {
  //   setMood(newValue);
  // };

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

    const updatedFormData = {
      ...formData, // Include all the existing form data (weight, steps, sleep, etc.)
      entryDate: date ? date.toISOString() : null, // Add the selected date
    };
  
    try {
      const token = authenticated()

      if (token) {
        await apiClient.post("/api/daily-entry/enter-daily-data", updatedFormData, {
          headers: { Authorization: `Bearer ${token}` }, // Pass token
        })
        console.log("Daily entry processed");
      }
    } catch (err) {
      console.log("Error submitting daily entry", err);
    }
  };

  return (
    <Box sx={box}>
      <Typography variant="h6" gutterBottom sx={title}>
        Enter your data here:
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Select a date"
          value={formatDate(date)}
          onClick={handleTextFieldClick}
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

        {/* Weight */}
        <Grid2 container spacing={2}>
          <Grid2 item xs={12} md={6}>
            <TextField
              label="Weight"
              variant="filled"
              fullWidth
              name="weight"
              value={formData.weight}
              onChange={handleChange}
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
          <Grid2 item xs={12} md={6}>
            <TextField
              label="Count"
              variant="filled"
              fullWidth
              name="steps"
              value={formData.steps}
              onChange={handleChange}
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
          <Grid2 item xs={12} md={6}>
            <TextField
              label="Sleep"
              variant="filled"
              fullWidth
              name="sleep"
              value={formData.sleep}
              onChange={handleChange}
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
          <Grid2 item xs={12} md={6}>
            <TextField
              label="Water"
              variant="filled"
              fullWidth
              name="water"
              value={formData.water}
              onChange={handleChange}
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
          <Grid2 item xs={12} md={6}>
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
                  sx: inputLable,
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
          <Grid2 item xs={12}>
            <Button type="submit" variant="contained" sx={submitButton}>
              Submit
            </Button>
          </Grid2>
        </Grid2>
      </form>
    </Box>
  );
}

export default DailyData;
