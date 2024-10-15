import { useEffect, useState } from "react";
import apiClient from "../services/apiClient.js";
import { authenticated } from "../utils/authenticate.js";
import {
  Box,
  Typography
} from "@mui/material";
import { box, bigTitle, dailyDataEntryCard, dailyDataEntryCardHeader, dailyDataEntryCardDelete } from "./style/styles.js";

function ManageDailyData() {
  const token = authenticated()
  
  const [data, setData] = useState([{}]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDailyData();
  }, [token]);

  const fetchDailyData = () => {
    if (token) {
      apiClient
        .get("/api/daily-entry/view-daily-data", {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          setError("Error fetching data. Try refreshing.");
        });
    }
  };


  const formatDate = (dateString) => {
    
    const dateObj = new Date(dateString);
    
    const options = {
      timeZone: 'UTC',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    };
  
    const formattedDate = dateObj.toLocaleDateString('en-US', options);
    
    return formattedDate;
  };

  const deleteEntry = (dailyEntryId) => {
    if (token) {
      apiClient
        .delete("/api/daily-entry/delete-entry", {
          headers: { Authorization: `Bearer ${token}` },
          data: { dailyEntryId }
        }) 
        .then((res) => {
          fetchDailyData(); 
        })
        .catch((err) => {
          setError("Error fetching data. Try refreshing.");
        });
    }
  }

  return (
    <Box sx={box}>
      <Typography variant="h6" gutterBottom sx={bigTitle}>
        Manage Daily Data
      </Typography>
      {Object.keys(data).length === 0 ? (
        <p>No data entered yet</p>
      ) : (
        data.map((dailyData, i) => (
          <div style={dailyDataEntryCard} key={i}>
            <div style={dailyDataEntryCardDelete} onClick={() => deleteEntry(dailyData.dailyEntryId)}>
              DELETE
            </div>
            <div style={dailyDataEntryCardHeader}>
              {formatDate(dailyData.entryDate)}: 
            </div>
            <div>
              Weight = {dailyData.weight} | Steps = {dailyData.steps} | Sleep = {dailyData.sleep} | Water = {dailyData.water} | Exercise = {dailyData.exercise}
            </div>
          </div>
        ))
      )}
    </Box>
  );
}

export default ManageDailyData;
