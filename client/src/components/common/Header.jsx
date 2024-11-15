// src/components/common/Header.jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  IconButton,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import {
  AccountCircle as AccountIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { logout } from '../../store/slices/authSlice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    dispatch(logout());
    localStorage.removeItem('token');
    navigate('/login');
  };

  const renderAuthButtons = () => {
    if (!isAuthenticated) {
      return (
        <>
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
          <Button color="inherit" component={Link} to="/register">
            Register
          </Button>
        </>
      );
    }

    const isTeacher = user?.role === 'teacher';

    return (
      <>
        {isTeacher ? (
          <>
            <Button color="inherit" component={Link} to="/teacher/dashboard">
              Teacher Dashboard
            </Button>
            <Button color="inherit" component={Link} to="/teacher/lessons/create">
              Create Lesson
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/dashboard">
              Dashboard
            </Button>
            <Button color="inherit" component={Link} to="/lessons">
              Lessons
            </Button>
          </>
        )}
        <Box>
          <IconButton
            color="inherit"
            onClick={handleMenu}
          >
            <AccountIcon />
            <Typography variant="body2" sx={{ ml: 1 }}>
              {user?.name}
            </Typography>
            <ExpandMoreIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem disabled>
              Role: {user?.role || 'student'}
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleClose} component={Link} to="/profile">
              Profile
            </MenuItem>
            {isTeacher && (
              <MenuItem onClick={handleClose} component={Link} to="/teacher/settings">
                Teacher Settings
              </MenuItem>
            )}
            <MenuItem onClick={handleLogout}>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </>
    );
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography 
          variant="h6" 
          component={Link} 
          to={user?.role === 'teacher' ? '/teacher/dashboard' : '/'} 
          sx={{ 
            flexGrow: 1, 
            textDecoration: 'none', 
            color: 'inherit' 
          }}
        >
          FunEnglish
        </Typography>
        {renderAuthButtons()}
      </Toolbar>
    </AppBar>
  );
};

export default Header;