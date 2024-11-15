import React, { useState, useEffect } from 'react';
import {
  Box, 
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import MultipleChoiceViewer from './viewers/MultipleChoiceViewer';
import FillBlankViewer from './viewers/FillBlankViewer';
import WordOrderViewer from './viewers/WordOrderViewer';
import MatchingViewer from './viewers/MatchingViewer';
import AudioAnswerViewer from './viewers/AudioAnswerViewer';
import api from '../../services/api';

const ExerciseViewer = ({ exercise, onComplete }) => {
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [timeLeft, setTimeLeft] = useState(exercise.timeLimit);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    let timer;
    if (hasStarted && timeLeft > 0 && !feedback) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [hasStarted, timeLeft, feedback]);

  const handleStart = () => {
    setHasStarted(true);
  };

  const handleAnswerChange = (newAnswer) => {
    setAnswer(newAnswer);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!answer && hasStarted) {
      setError('Please provide an answer before submitting');
      return;
    }
  
    setLoading(true);
    setError(null);
  
    try {
      if (!exercise._id) {
        throw new Error('Invalid exercise ID');
      }
  
      const response = await api.post(`/exercises/${exercise._id}/submit`, {
        answer,
        timeTaken: exercise.timeLimit - timeLeft
      });
  
      setFeedback({
        isCorrect: response.data.isCorrect,
        message: response.data.isCorrect 
          ? 'Correct! Well done!' 
          : 'Not quite right. Try again!',
        correctAnswer: response.data.correctAnswer,
        explanation: response.data.explanation,
        progress: response.data.progress
      });
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.response?.data?.message || 'Error submitting answer');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (feedback) {
      onComplete?.(feedback.progress);
    }
  };

  const handleTryAgain = () => {
    setFeedback(null);
    setAnswer(null);
  };

  const renderExerciseContent = () => {
    const viewerProps = {
      content: exercise.content,
      onChange: handleAnswerChange,
      value: answer,
      disabled: !!feedback || !hasStarted,
      feedback
    };

    switch (exercise.type) {
      case 'multiple_choice':
        return <MultipleChoiceViewer {...viewerProps} />;
      case 'fill_blank':
        return <FillBlankViewer {...viewerProps} />;
      case 'word_order':
        return <WordOrderViewer {...viewerProps} />;
      case 'matching':
        return <MatchingViewer {...viewerProps} />;
      case 'audio_answer':
        return <AudioAnswerViewer {...viewerProps} />;
      default:
        return <Typography color="error">Unknown exercise type</Typography>;
    }
  };

  return (
    <Box>
      {hasStarted ? (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Time Left: {timeLeft}s
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Points: {exercise.points}
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={(timeLeft / exercise.timeLimit) * 100} 
          />
        </Box>
      ) : (
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="body1" paragraph>
            You have {exercise.timeLimit} seconds to complete this exercise.
          </Typography>
          <Button
            variant="contained"
            onClick={handleStart}
          >
            Start Exercise
          </Button>
        </Box>
      )}

      <Paper sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {exercise.question}
          </Typography>
          <Typography color="text.secondary">
            {exercise.instructions}
          </Typography>
        </Box>

        {renderExerciseContent()}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {feedback && (
          <Alert 
            severity={feedback.isCorrect ? "success" : "warning"}
            sx={{ mt: 2 }}
          >
            <Typography variant="subtitle2" gutterBottom>
              {feedback.message}
            </Typography>
            {!feedback.isCorrect && feedback.correctAnswer && (
              <Typography variant="body2">
                Correct answer: {feedback.correctAnswer}
              </Typography>
            )}
            {feedback.explanation && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {feedback.explanation}
              </Typography>
            )}
          </Alert>
        )}

        {hasStarted && (
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            {feedback && !feedback.isCorrect && exercise.allowRetry && (
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleTryAgain}
              >
                Try Again
              </Button>
            )}
            {feedback ? (
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={handleContinue}
              >
                Continue
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading || !answer}
              >
                {loading ? <CircularProgress size={24} /> : 'Submit Answer'}
              </Button>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ExerciseViewer;