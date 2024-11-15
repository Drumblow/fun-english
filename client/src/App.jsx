// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme } from '@mui/material/styles';

// Components
import Header from './components/common/Header';
import PrivateRoute from './components/navigation/PrivateRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Lessons from './pages/Lessons';
import LessonView from './pages/lessons/LessonView'; 
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import CreateLesson from './pages/teacher/CreateLesson';
import TeacherRoute from './components/navigation/TeacherRoute';

// Theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#0088ff',
      light: '#4da6ff',
      dark: '#0066cc',
    },
    secondary: {
      main: '#f5ba5a',
      light: '#f7d794',
      dark: '#f19066',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/" 
            element={
              <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-center mt-20">
                  Welcome to FunEnglish
                </h1>
                <p className="text-center mt-4 text-gray-600">
                  Learn English in a fun and interactive way
                </p>
              </div>
            } 
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student Routes */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/lessons" 
            element={
              <PrivateRoute>
                <Lessons />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/lessons/:id" 
            element={
              <PrivateRoute>
                <LessonView />
              </PrivateRoute>
            } 
          />

          {/* Teacher Routes */}
          <Route 
            path="/teacher/dashboard" 
            element={
              <TeacherRoute>
                <TeacherDashboard />
              </TeacherRoute>
            } 
          />
          <Route 
            path="/teacher/lessons/create" 
            element={
              <TeacherRoute>
                <CreateLesson />
              </TeacherRoute>
            } 
          />

          {/* Catch all - 404 */}
          <Route 
            path="*" 
            element={
              <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-center mt-20">
                  404 - Page Not Found
                </h1>
                <p className="text-center mt-4 text-gray-600">
                  The page you're looking for doesn't exist.
                </p>
              </div>
            } 
          />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;