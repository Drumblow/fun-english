// src/pages/teacher/TeacherDashboard.jsx
import React from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Button, 
  Box,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import {
  Add as AddIcon,
  List as ListIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const TeacherDashboard = () => {
  const actions = [
    {
      title: 'Create New Lesson',
      description: 'Create a new lesson with content and exercises',
      icon: <AddIcon fontSize="large" />,
      link: '/teacher/lessons/create',
      color: 'primary',
    },
    {
      title: 'Manage Lessons',
      description: 'Edit, delete or publish existing lessons',
      icon: <ListIcon fontSize="large" />,
      link: '/teacher/lessons',
      color: 'secondary',
    },
    {
      title: 'Student Progress',
      description: 'View and analyze student performance',
      icon: <AssessmentIcon fontSize="large" />,
      link: '/teacher/progress',
      color: 'success',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Teacher Dashboard
        </Typography>
        <Typography color="textSecondary">
          Manage your lessons and track student progress
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {actions.map((action) => (
          <Grid item xs={12} sm={6} md={4} key={action.title}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mb: 2 
                }}>
                  {React.cloneElement(action.icon, { 
                    color: action.color,
                    sx: { fontSize: 48 } 
                  })}
                </Box>
                <Typography variant="h6" component="h2" gutterBottom align="center">
                  {action.title}
                </Typography>
                <Typography color="textSecondary" align="center">
                  {action.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  component={Link} 
                  to={action.link}
                  fullWidth 
                  variant="contained"
                  color={action.color}
                >
                  Access
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TeacherDashboard;