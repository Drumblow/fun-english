// src/pages/Lessons.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  Container,
  Button
} from '@mui/material';
import {
  Lock as LockIcon,
  CheckCircle as CheckCircleIcon,
  PlayArrow as PlayArrowIcon
} from '@mui/icons-material';
import api from '../services/api';

const Lessons = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await api.get('/lessons');
        console.log('Lessons fetched:', response.data); // Para debug
        setLessons(response.data);
      } catch (error) {
        console.error('Error fetching lessons:', error);
        setError(error.response?.data?.message || 'Error loading lessons');
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  const getCategoryColor = (category) => {
    const colors = {
      Grammar: 'primary',
      Vocabulary: 'success',
      Conversation: 'info',
      Reading: 'warning',
      Listening: 'secondary'
    };
    return colors[category] || 'default';
  };

  const handleStartLesson = async (lessonId) => {
    try {
      await api.post(`/lessons/${lessonId}/start`);
      navigate(`/lessons/${lessonId}`);
    } catch (error) {
      console.error('Error starting lesson:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 4 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Available Lessons
      </Typography>

      <Grid container spacing={3}>
        {lessons.map((lesson) => (
          <Grid item xs={12} sm={6} md={4} key={lesson._id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
              }}
            >
              {lesson.isCompleted && (
                <CheckCircleIcon
                  color="success"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8
                  }}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {lesson.title}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={`Level ${lesson.level}`}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={lesson.category}
                    color={getCategoryColor(lesson.category)}
                    size="small"
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {lesson.description}
                </Typography>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" display="block" gutterBottom>
                    Duration: {lesson.duration} minutes
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  startIcon={lesson.isLocked ? <LockIcon /> : <PlayArrowIcon />}
                  fullWidth
                  disabled={lesson.isLocked}
                  onClick={() => handleStartLesson(lesson._id)}
                  sx={{ mt: 2 }}
                >
                  {lesson.isLocked ? 'Locked' : 'Start Lesson'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Lessons;