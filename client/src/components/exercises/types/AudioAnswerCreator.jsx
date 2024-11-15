// src/components/exercises/types/AudioAnswerCreator.jsx
import React from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Paper,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

const AudioAnswerCreator = ({ content, onChange }) => {
  const handleAudioUrlChange = (value) => {
    onChange({
      ...content,
      audioUrl: value
    });
  };

  const handleAddTranscription = () => {
    onChange({
      ...content,
      acceptedTranscriptions: [...(content.acceptedTranscriptions || []), '']
    });
  };

  const handleTranscriptionChange = (index, value) => {
    const newTranscriptions = content.acceptedTranscriptions.map((trans, i) => {
      if (i === index) return value;
      return trans;
    });
    onChange({
      ...content,
      acceptedTranscriptions: newTranscriptions
    });
  };

  const handleRemoveTranscription = (index) => {
    const newTranscriptions = content.acceptedTranscriptions.filter((_, i) => i !== index);
    onChange({
      ...content,
      acceptedTranscriptions: newTranscriptions
    });
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Audio Answer Exercise
      </Typography>

      <Alert severity="info" sx={{ mb: 2 }}>
        Note: Audio file should be already hosted and accessible via URL.
        Make sure the audio is clear and the pronunciation is correct.
      </Alert>

      <TextField
        fullWidth
        label="Audio URL"
        value={content.audioUrl || ''}
        onChange={(e) => handleAudioUrlChange(e.target.value)}
        sx={{ mb: 3 }}
      />

      {content.audioUrl && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Audio Preview:
          </Typography>
          <audio controls>
            <source src={content.audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </Box>
      )}

      <Typography variant="subtitle2" gutterBottom>
        Accepted Transcriptions:
      </Typography>

      {(content.acceptedTranscriptions || []).map((transcription, index) => (
        <Paper key={index} sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              label={`Transcription ${index + 1}`}
              value={transcription}
              onChange={(e) => handleTranscriptionChange(index, e.target.value)}
            />
            <IconButton
              color="error"
              onClick={() => handleRemoveTranscription(index)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Paper>
      ))}

      <Button
        startIcon={<AddIcon />}
        onClick={handleAddTranscription}
        variant="outlined"
        fullWidth
      >
        Add Accepted Transcription
      </Button>
    </Box>
  );
};

export default AudioAnswerCreator;