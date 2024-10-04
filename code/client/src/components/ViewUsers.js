//will update this file with better error handling as per Mosh video

import { useEffect, useState } from "react";
import apiClient from "../services/apiClient.js";
import { authenticated } from "../utils/authenticate.js";
import {
  Box,
  Typography
} from "@mui/material";
import { box, bigTitle } from "./style/styles.js";

function ViewUsers() {
  authenticated();
  const [data, setData] = useState([{}]);

  useEffect(() => {
    apiClient
      .get("/view-users")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Box sx={box}>
      <Typography variant="h6" gutterBottom sx={bigTitle}>
        Viewing Users
      </Typography>
      {typeof data === "undefined" ? (
        <p>Loading...</p>
      ) : (
        data.map((user, i) => (
          <p key={i}>
            {i + 1}. ID: {user.userId} | Name: {user.name} | Email: {user.email}
          </p>
        ))
      )}
    </Box>
  );
}

export default ViewUsers;
