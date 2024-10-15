import "../App.css";
import React, { useState, useEffect } from "react"; 
import apiClient from "../services/apiClient.js";
import ChartBox from "./ChartBox.js";
import { Chart, registerables } from "chart.js"; 
import { Typography, Grid2, Box } from "@mui/material";
import { bigTitle, title, dashboardLineChartContainer } from "./style/styles.js";
import { authenticated } from "../utils/authenticate.js";

import MonitorWeightIcon from "@mui/icons-material/MonitorWeight";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import OpacityIcon from "@mui/icons-material/Opacity";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

// Register the required components for Chart.js
Chart.register(...registerables);

function Home({ initialData = [] }) {
  const [userData, setUserData] = useState({
    name: "",
    firstName: "",
  });
  const [error, setError] = useState(null);
  const [lastSevenDaysData, setLastSevenDaysData] = useState(initialData);
  const [goalData, setGoalData] = useState([]);
  const [dayLabels, setDayLabels] = useState([]);

  useEffect(() => {
    const token = authenticated();

    if (token) {
      // Fetch user profile
      apiClient
        .get("/api/users/manage-profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const { name } = res.data;
          setUserData({
            name: name || "",
            firstName: name.split(" ")[0] || "",
          });
        })
        .catch((err) => {
          setError("Error fetching profile data. Try refreshing.");
        });
      
        if (initialData.length === 0) {
          // Fetch last seven days of data 
          apiClient
            .post("/api/daily-entry/last-seven-days", { dateString: new Date().toLocaleDateString('en-CA') }, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
              setLastSevenDaysData(res.data.data);
              var days = []
              res.data.data.map(entry => days.push(new Date(entry.day).toUTCString().split(',')[0]))
              setDayLabels(days)
            })
            .catch((err) => {
              setError("Error fetching last seven days data.");
            });
        } else {
          var days = []
          initialData.map(entry => days.push(new Date(entry.day).toUTCString().split(',')[0]));
          setDayLabels(days);
        }  

      // Fetch goal
      apiClient
        .get("/api/goals/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setGoalData(res.data);
        })
        .catch((err) => {
          setError("Error fetching goal data.");
        });
    }
  }, [initialData]);

  // Factory function to create chart configuration
  const createChartConfig = (label, data, goal, icon, color, unit) => {
    const minBuffer = 0.8;
    const maxBuffer = 1.2;

    const suggestedMin = Math.min(...data.filter(val => val !== null)) * minBuffer; // Filter out null values
    const suggestedMax = Math.max(...data.filter(val => val !== null)) * maxBuffer; // Filter out null values
    
    return {
      label,
      data,
      goal,
      icon,
      color,
      unit,
      suggestedMin,
      suggestedMax,
    };
  };

  const dataConfig = [
    createChartConfig(
      "Weight",
      lastSevenDaysData.map(entry => entry.data ? entry.data.weight : null), // Get weights or null
      goalData ? goalData.weightLbs : null,
      MonitorWeightIcon,
      "75,192,192",
      "lbs"
    ),
    createChartConfig(
      "Steps",
      lastSevenDaysData.map(entry => entry.data ? entry.data.steps : null), // Get steps or null
      goalData ? goalData.stepsCounts : null,
      DirectionsWalkIcon,
      "255,99,132",
      "steps"
    ),
    createChartConfig(
      "Sleep",
      lastSevenDaysData.map(entry => entry.data ? entry.data.sleep : null), // Get sleep hours or null
      goalData ? goalData.sleepHours : null,
      BedtimeIcon,
      "255,160,86",
      "hours"
    ),
    createChartConfig(
      "Water",
      lastSevenDaysData.map(entry => entry.data ? entry.data.water : null), // Get water intake or null
      goalData ? goalData.waterIntakeGlasses : null,
      OpacityIcon,
      "54,162,235",
      "glasses"
    ),
    createChartConfig(
      "Exercise",
      lastSevenDaysData.map(entry => entry.data ? entry.data.exercise : null), // Get exercise minutes or null
      goalData ? goalData.exerciseMinutes : null,
      FitnessCenterIcon,
      "153,102,255",
      "minutes"
    ),
  ];

  // General settings
  const borderWidth = 2;
  const pointRadius = 5;
  const pointBorderWidth = borderWidth;

  const setTransparency = (color, value) => {
    return `rgba(${color},${value})`;
  };

  const getChartData = (config) => ({
    labels: dayLabels,
    datasets: [
      {
        label: `Recorded ${config.label} (${config.unit})`,
        data: config.data,
        borderWidth: borderWidth,
        borderColor: setTransparency(config.color, 1),
        pointBackgroundColor: setTransparency(config.color, 1),
        pointBorderColor: "white",
        pointRadius: pointRadius,
        pointBorderWidth: pointBorderWidth,
        fill: false,
      },
      {
        label: "Goal",
        data: Array(7).fill(config.goal),
        borderColor: setTransparency(config.color, 0.25),
        pointRadius: 0,
        fill: 'start',
        backgroundColor: setTransparency(config.color, 0.1),
      },
    ],
  });

  const dynamicOptions = (suggestedMin, suggestedMax) => ({
    maintainAspectRatio: true,
    responsive: true,
    scales: {
      y: {
        suggestedMin: suggestedMin,
        suggestedMax: suggestedMax,
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          usePointStyle: true,
          boxWidth: pointRadius + pointBorderWidth,
          boxHeight: pointRadius + pointBorderWidth,
        },
      },
    },
  });

  return (
    <Box sx={{ paddingBottom: 2 }}>
      <Typography sx={{ ...bigTitle, textAlign: 'center', paddingTop: '1em' }}>
        {userData.firstName
          ? `Welcome, ${userData.firstName}!`
          : `Welcome, ${userData.name}`}{" "}
        <br />
      </Typography>
      {lastSevenDaysData.every(val => val.data === null) ? (
        <Typography sx={{ ...title, textAlign: 'center', paddingTop: '1em' }}>
          Enter some daily data for the past week to see your progress
        </Typography>
      ) : (
        <>
          <Typography sx={{ ...title, textAlign: 'center', paddingTop: '1em' }}>
            Here is your daily data for the last week
          </Typography>
          <Grid2 container justifyContent="center" spacing={2}>
            {dataConfig.map((config) => (
              <ChartBox
              key={config.label}
              title={config.label}
              chartData={getChartData(config)}
              chartOptions={dynamicOptions(config.suggestedMin, config.suggestedMax)}
              style={dashboardLineChartContainer}
              IconComponent={config.icon}
              />
            ))}
          </Grid2>
        </>
      )}
    </Box>
  );
}

export default Home;
