// src/pages/Login.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Box, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  CircularProgress,
  Alert
} from '@mui/material';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import api from '../services/api';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    
    try {
      const response = await api.post('/auth/login', formData);
      
      const { user, token } = response.data;
      localStorage.setItem('token', token);
      
      dispatch(loginSuccess({ user, token }));
      
      // Redirecionar baseado no papel do usuário
      if (user.role === 'teacher') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.message || 'Login failed'));
    }
  };

  return (
    <Box 
      className="min-h-[calc(100vh-64px)] flex items-center justify-center"
      sx={{ backgroundColor: 'grey.100' }}
    >
      <Paper 
        elevation={3} 
        className="p-8 w-full max-w-md mx-4"
      >
        <Typography 
          variant="h4" 
          component="h1" 
          className="text-center mb-6 text-primary"
        >
          Welcome Back!
        </Typography>

        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            variant="outlined"
          />
          
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            variant="outlined"
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            disabled={isLoading}
            className="mt-6"
          >
            {isLoading ? <CircularProgress size={24} /> : 'Login'}
          </Button>

          <Typography className="text-center mt-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:underline">
              Register here
            </Link>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;