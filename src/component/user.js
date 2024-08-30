import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, Avatar } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';

const UserMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Clear the stored username
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    // Redirect to login page
    window.location.href = '/login';
    handleMenuClose();
  };

  return (
    <>
      <IconButton
        edge="end"
        color="inherit"
        onClick={handleMenuOpen}
      >
        <Avatar>
          <AccountCircle />
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
        <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
