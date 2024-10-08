import '../App.css';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Typography } from "@mui/material";
import { title, dashboardLineChartContainer } from "./style/styles.js";
import { authenticated } from "../utils/authenticate.js";

// Register the required components for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


function Home() {
    authenticated();

    //update these constants with data from database
    const dayLabels = ['Day1', 'Day2', 'Day3', 'Day4', 'Day5', 'Day6', 'Day7']

    const weightData = [150, 152, 149, 151, 148, 147, 150];
    const weightGoal = 150;

    const stepsData = [6000, 8000, 7500, 9000, 6500, 5000, 7000];
    const stepsGoal = 10000;

    const sleepData = [6, 7, 5, 8, 6, 7, 5];
    const sleepGoal = 7;

    const waterData = [8, 6, 7, 5, 8, 7, 6];
    const waterGoal = 8;

    const exerciseData = [30, 45, 60, 20, 40, 30, 50];
    const exerciseGoal = 40;

    // Fill in the chart data
    const weightChart = {
        labels: dayLabels, // X-axis labels
        datasets: [
            {
                label: 'Weight in lbs',
                data: weightData, // Y-axis values
                borderColor: 'rgba(75,192,192,1)', // Teal
                pointRadius: 4,
            },
            {
                label: 'Goal',
                data: Array(7).fill(weightGoal), // plot the goal if applicable
                borderColor: 'rgba(75,192,192,.25)', // Teal with 25% transparency
                pointRadius: 0,
            },
        ],
    };
    
    const stepsChart = {
        labels: dayLabels, // X-axis labels
        datasets: [
            {
                label: 'Steps',
                data: stepsData, // Y-axis values
                borderColor: 'rgba(255,99,132,1)', // Red
                pointRadius: 4,
            },
            {
                label: 'Goal',
                data: Array(7).fill(stepsGoal), // plot the goal if applicable
                borderColor: 'rgba(255,99,132,.25)', // Red with 25% transparency
                pointRadius: 0,
            },
        ],
    };
    
    const sleepChart = {
        labels: dayLabels, // X-axis labels
        datasets: [
            {
                label: 'Sleep in hours',
                data: sleepData, // Y-axis values
                borderColor: 'rgba(54,162,235,1)', // Blue
                pointRadius: 4,
            },
            {
                label: 'Goal',
                data: Array(7).fill(sleepGoal), // plot the goal if applicable
                borderColor: 'rgba(54,162,235,.25)', // Blue with 25% transparency
                pointRadius: 0,
            },
        ],
    };
    
    const waterChart = {
        labels: dayLabels, // X-axis labels
        datasets: [
            {
                label: 'Water in glasses',
                data: waterData, // Y-axis values
                borderColor: 'rgba(255,205,86,1)', // Yellow
                pointRadius: 4,
            },
            {
                label: 'Goal',
                data: Array(7).fill(waterGoal), // plot the goal if applicable
                borderColor: 'rgba(255,205,86,.25)', // Yellow with 25% transparency
                pointRadius: 0,
            },
        ],
    };
    
    const exerciseChart = {
        labels: dayLabels, // X-axis labels
        datasets: [
            {
                label: 'Exercise in minutes',
                data: exerciseData, // Y-axis values
                borderColor: 'rgba(153,102,255,1)', // Purple
                pointRadius: 4,
            },
            {
                label: 'Goal',
                data: Array(7).fill(exerciseGoal), // plot the goal if applicable
                borderColor: 'rgba(153,102,255,.25)', // Purple with 25% transparency
                pointRadius: 0,
            },
        ],
    };
    
    
    // Set chart options
    const options = {
        maintainAspectRatio: false,
        scales: {
            y: {
                min: 0
            },
        },
    };

    return (
        <div>
            <Typography variant="h6" gutterBottom sx={title}>
                See your progress:
            </Typography>
            <div style={dashboardLineChartContainer}>
                <Line data={weightChart} options={options} />
            </div>
            <div style={dashboardLineChartContainer}>
                <Line data={stepsChart} options={options} />
            </div>
            <div style={dashboardLineChartContainer}>
                <Line data={sleepChart} options={options} />
            </div>
            <div style={dashboardLineChartContainer}>
                <Line data={waterChart} options={options} />
            </div>
            <div style={dashboardLineChartContainer}>
                <Line data={exerciseChart} options={options} />
            </div>
        </div>
    )
}

export default Home;