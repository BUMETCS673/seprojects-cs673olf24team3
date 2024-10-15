import React from "react";
import { Line } from "react-chartjs-2";
import { Typography, Grid2, Box } from "@mui/material";

const ChartBox = ({
  title,
  chartData,
  chartOptions,
  style,
  IconComponent,
}) => (
  <Grid2 xs={12} sm={6}>
    <Box
      sx={{
        backgroundColor: "#ffffff",
        borderRadius: 2,
        padding: 2,
        boxShadow: 2,
        height: "100%",
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{ display: "flex", alignItems: "center" }}
      >
        {IconComponent && <IconComponent sx={{ marginRight: 1 }} />}
        {title}
      </Typography>
      <div style={style}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </Box>
  </Grid2>
);

export default ChartBox;