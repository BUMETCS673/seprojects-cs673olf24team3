import React from 'react';
import { useNavigate } from 'react-router-dom';
import { destroyCookie } from 'nookies';
import LogoutIcon from '@mui/icons-material/Logout';
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

function LogoutButton({ setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    destroyCookie(null, 'authToken');
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
