import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Card,
  LinearProgress,
} from '@mui/material';
import {
  Book as TheoryIcon,
  QuestionAnswer as ExerciseIcon,
  EmojiEvents as TrophyIcon,
} from '@mui/icons-material';
import ExerciseViewer from '../../components/exercises/ExerciseViewer';
import api from '../../services/api';

const LessonView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState({
    currentExercise: 0,
    completed: false,
    score: 0,
    maxScore: 0,
    exerciseResults: []
  });

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await api.get(`/lessons/${id}`);
        setLesson(response.data);
        setProgress(prev => ({
          ...prev,
          maxScore: response.data.exercises?.reduce((sum, ex) => sum + ex.points, 0) || 0
        }));
      } catch (err) {
        setError(err.response?.data?.message || 'Error loading lesson');
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [id]);

  const handleExerciseComplete = (exerciseResult) => {
    if (!exerciseResult) return;

    setProgress(prev => {
      const newScore = (prev.score || 0) + (exerciseResult.score || 0);
      const newExerciseResults = [...(prev.exerciseResults || []), exerciseResult];
      const isCompleted = newExerciseResults.length === lesson?.exercises?.length;

      return {
        ...prev,
        currentExercise: (prev.currentExercise || 0) + 1,
        score: newScore,
        completed: isCompleted,
        exerciseResults: newExerciseResults
      };
    });

    setActiveStep(prev => prev + 1);
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          {error}
        </Alert>
        <Button
          variant="outlined"
          onClick={() => navigate('/lessons')}
          sx={{ mt: 2 }}
        >
          Back to Lessons
        </Button>
      </Container>
    );
  }

  if (!lesson) return null;

  const steps = [
    {
      label: 'Theory',
      icon: <TheoryIcon />,
      content: (
        <Box>
          <Typography variant="h6" gutterBottom>
            {lesson.title}
          </Typography>
          <Typography color="text.secondary" paragraph>
            {lesson.description}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography 
            dangerouslySetInnerHTML={{ __html: lesson.content.theory }}
            sx={{ whiteSpace: 'pre-wrap' }}
          />
          {lesson.content.examples?.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Examples
              </Typography>
              {lesson.content.examples.map((example, index) => (
                <Card key={index} sx={{ p: 2, mb: 2 }}>
                  <Typography>{example}</Typography>
                </Card>
              ))}
            </Box>
          )}
        </Box>
      )
    },
    ...(lesson.exercises || []).map((exercise, index) => ({
      label: `Exercise ${index + 1}`,
      icon: <ExerciseIcon />,
      content: (
        <ExerciseViewer
          exercise={exercise}
          onComplete={handleExerciseComplete}
        />
      )
    })),
    {
      label: 'Complete',
      icon: <TrophyIcon />,
      content: (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <TrophyIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Congratulations!
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            You've completed this lesson!
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Your Score: {progress.score} / {progress.maxScore}
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={(progress.score / progress.maxScore) * 100}
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>
          <Button
            variant="contained"
            onClick={() => navigate('/lessons')}
            size="large"
          >
            Continue Learning
          </Button>
        </Box>
      )
    }
  ];

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ position: 'sticky', top: 0, bgcolor: 'background.default', py: 2, zIndex: 1 }}>
        <LinearProgress 
          variant="determinate" 
          value={(activeStep / (steps.length - 1)) * 100} 
          sx={{ mb: 2 }}
        />
        <Typography variant="subtitle2" color="text.secondary" align="right">
          Progress: {Math.round((activeStep / (steps.length - 1)) * 100)}%
        </Typography>
      </Box>
  
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel StepIconComponent={() => step.icon}>
              {step.label}
            </StepLabel>
            <StepContent>
              <Paper sx={{ p: 3, mb: 2 }}>
                {step.content}
              </Paper>
              <Box sx={{ mb: 2 }}>
                <div>
                  {index === 0 && (
                    <Button
                      variant="contained"
                      onClick={() => setActiveStep(prev => prev + 1)}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Start Exercises
                    </Button>
                  )}
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Container>
  );
};

export default LessonView;