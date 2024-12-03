import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  Alert,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  VolumeUp as VolumeIcon,
} from '@mui/icons-material';

const AudioAnswerViewer = ({ content, onChange, value, disabled, feedback }) => {
  const [answer, setAnswer] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(new Audio(content.audioUrl));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (value) {
      setAnswer(value);
    }
  }, [value]);

  useEffect(() => {
    // Configurar os event listeners do áudio
    audio.addEventListener('ended', () => setIsPlaying(false));
    audio.addEventListener('error', () => {
      setError('Error loading audio file');
      setIsPlaying(false);
    });

    // Cleanup
    return () => {
      audio.removeEventListener('ended', () => setIsPlaying(false));
      audio.removeEventListener('error', () => setError('Error loading audio file'));
      audio.pause();
    };
  }, [audio]);

  const togglePlay = () => {
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const handleAnswerChange = (e) => {
    const newValue = e.target.value;
    setAnswer(newValue);
    onChange(newValue);
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3, backgroundColor: 'grey.50' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            onClick={togglePlay}
            disabled={!!error}
            size="large"
            color="primary"
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </IconButton>

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {isPlaying ? 'Playing audio...' : 'Click play to listen'}
            </Typography>
          </Box>

          <VolumeIcon color="action" />
        </Box>
      </Paper>

      <TextField
        fullWidth
        multiline
        rows={3}
        label="Type what you hear"
        value={answer}
        onChange={handleAnswerChange}
        disabled={disabled}
        error={feedback && !feedback.isCorrect}
        helperText={
          feedback && !feedback.isCorrect
            ? 'Your answer doesn\'t match any accepted transcriptions'
            : 'Listen carefully and type exactly what you hear'
        }
      />

      {feedback && !feedback.isCorrect && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" color="error.main" gutterBottom>
            Accepted answers:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {content.acceptedTranscriptions.map((transcription, index) => (
              <Paper 
                key={index}
                sx={{ 
                  p: 2,
                  bgcolor: 'success.50',
                  border: 1,
                  borderColor: 'success.main'
                }}
              >
                <Typography variant="body2">
                  {transcription}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AudioAnswerViewer;