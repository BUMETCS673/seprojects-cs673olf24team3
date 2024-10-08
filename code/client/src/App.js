import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./components/Home.js";
import Login from "./components/Login.js";
import CreateUser from "./components/CreateUser.js";
import ViewUsers from "./components/ViewUsers.js";
import ManageProfile from "./components/ManageProfile.js";
import DailyData from "./components/DailyData.js";
import CreateGoal from "./components/CreateGoal.js";
import ManageDailyData from "./components/ManageDailyData.js";
import LogoutButton from "./components/Logout.js";

import React, { useState, useEffect } from "react";
import LogoutIcon from "@mui/icons-material/Logout";

// Styling
import {
  createTheme,
  CssBaseline,
  ThemeProvider,
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import LoginIcon from "@mui/icons-material/Login";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditNoteIcon from "@mui/icons-material/EditNote";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import TodayIcon from "@mui/icons-material/Today";
import CloseIcon from "@mui/icons-material/Close";

import { useNavigate } from "react-router-dom";

import "@fontsource/mulish";

const sidebarWidth = "10vw";
const appBarHeight = "4rem";

const theme = createTheme({
  typography: {
    fontFamily: "'Mulish', sans-serif",
  },
  palette: {
    primary: {
      main: "#e2ddd5",
    },
  },
});

function App({ RouterComponent = Router }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // On component mount, check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <RouterComponent>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />

          {/* AppBar at the top */}
          <AppBar
            position="fixed"
            sx={{
              width: `calc(100% - ${sidebarWidth})`,
              ml: `${sidebarWidth}`,
              height: `${appBarHeight}`,
              bgcolor: "primary.main",
              boxShadow: theme.shadows[1],
            }}
          >
            <Toolbar
              sx={{ display: "flex", alignItems: "center", height: "100%" }}
            >
              <Typography variant="h5" noWrap component="div">
                Health and Wellness Tracker
              </Typography>
            </Toolbar>
          </AppBar>

          {/* Left side navigation drawer */}
          <Drawer
            sx={{
              width: sidebarWidth,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: sidebarWidth,
                boxSizing: "border-box",
              },
            }}
            variant="permanent"
            anchor="left"
          >
            <img
              src="/app-logo.png"
              alt="Logo"
              style={{
                height: `${appBarHeight - "4rem"}`,
                width: `${appBarHeight - "4rem"}`,
                margin: "10%",
              }}
            />
            <Divider />

            {/* Sidebar Navigation */}
            <List>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/">
                  <ListItemIcon>
                    {" "}
                    <HomeIcon />{" "}
                  </ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItemButton>
              </ListItem>

              {!isAuthenticated ? (
                <ListItem disablePadding>
                  <ListItemButton component={Link} to="/login">
                    <ListItemIcon>
                      <LoginIcon />
                    </ListItemIcon>
                    <ListItemText primary="Login" />
                  </ListItemButton>
                </ListItem>
              ) : (
                <LogoutButton setIsAuthenticated={setIsAuthenticated} />
              )}

              <ListItem disablePadding>
                <ListItemButton component={Link} to="/enter-daily-data">
                  <ListItemIcon>
                    {" "}
                    <EditNoteIcon />{" "}
                  </ListItemIcon>
                  <ListItemText primary="Record Daily Data" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton component={Link} to="/manage-daily-data">
                  <ListItemIcon>
                    {" "}
                    <TodayIcon />{" "}
                  </ListItemIcon>
                  <ListItemText primary="Manage Daily Data" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton component={Link} to="/create-goal">
                  <ListItemIcon>
                    {" "}
                    <TrackChangesIcon />{" "}
                  </ListItemIcon>
                  <ListItemText primary="Create Goal" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton component={Link} to="/manage-profile">
                  <ListItemIcon>
                    {" "}
                    <AccountCircleIcon />{" "}
                  </ListItemIcon>
                  <ListItemText primary="Manage Profile" />
                </ListItemButton>
              </ListItem>

              {/* <ListItem disablePadding>
                <ListItemButton component={Link} to="/view-users">
                  <ListItemIcon>
                    {" "}
                    <CloseIcon />{" "}
                  </ListItemIcon>
                  <ListItemText primary="View Users (delete?)" />
                </ListItemButton>
              </ListItem> */}
            </List>
          </Drawer>

          {/* Main content */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              bgcolor: "#E2DDD5", // Background color applied here
              minHeight: "100vh", // Full viewport height for every page
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Toolbar />
            <Box
              sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}
            >
              {/* Routes need to be outside of the Drawer, so that they render in the main content area */}
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create-user" element={<CreateUser />} />
                <Route path="/view-users" element={<ViewUsers />} />
                <Route path="/manage-profile" element={<ManageProfile />} />
                <Route
                  path="/login"
                  element={<Login setIsAuthenticated={setIsAuthenticated} />}
                />
                <Route path="/enter-daily-data" element={<DailyData />} />
                <Route
                  path="/manage-daily-data"
                  element={<ManageDailyData />}
                />
                <Route path="/create-goal" element={<CreateGoal />} />
              </Routes>
            </Box>
          </Box>
        </Box>
      </RouterComponent>
    </ThemeProvider>
  );
}

export default App;
