// LogoutButton.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

function LogoutButton({ setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleLogout = () => {
 
    localStorage.removeItem('authToken');

    setIsAuthenticated(false);

    navigate('/login');
  };

  return (
    <ListItem disablePadding>
      <ListItemButton onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </ListItem>
  );
}

export default LogoutButton;
