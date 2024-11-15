// src/components/exercises/types/FillBlankCreator.jsx
import React from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Chip,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

const FillBlankCreator = ({ content, onChange }) => {
  const handleTextChange = (value) => {
    onChange({
      ...content,
      text: value,
    });
  };

  const handleAddBlank = () => {
    const newBlank = {
      position: content.text.length,
      correctAnswer: '',
      alternatives: ['']
    };
    onChange({
      ...content,
      blanks: [...(content.blanks || []), newBlank]
    });
  };

  const handleRemoveBlank = (index) => {
    const newBlanks = content.blanks.filter((_, i) => i !== index);
    onChange({
      ...content,
      blanks: newBlanks
    });
  };

  const handleBlankChange = (index, field, value) => {
    const newBlanks = content.blanks.map((blank, i) => {
      if (i === index) {
        return { ...blank, [field]: value };
      }
      return blank;
    });
    onChange({
      ...content,
      blanks: newBlanks
    });
  };

  const handleAddAlternative = (blankIndex) => {
    const newBlanks = content.blanks.map((blank, index) => {
      if (index === blankIndex) {
        return {
          ...blank,
          alternatives: [...blank.alternatives, '']
        };
      }
      return blank;
    });
    onChange({
      ...content,
      blanks: newBlanks
    });
  };

  const handleAlternativeChange = (blankIndex, altIndex, value) => {
    const newBlanks = content.blanks.map((blank, index) => {
      if (index === blankIndex) {
        const newAlternatives = [...blank.alternatives];
        newAlternatives[altIndex] = value;
        return {
          ...blank,
          alternatives: newAlternatives
        };
      }
      return blank;
    });
    onChange({
      ...content,
      blanks: newBlanks
    });
  };

  const handleRemoveAlternative = (blankIndex, altIndex) => {
    const newBlanks = content.blanks.map((blank, index) => {
      if (index === blankIndex) {
        return {
          ...blank,
          alternatives: blank.alternatives.filter((_, i) => i !== altIndex)
        };
      }
      return blank;
    });
    onChange({
      ...content,
      blanks: newBlanks
    });
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Text with Blanks
      </Typography>

      <TextField
        fullWidth
        multiline
        rows={4}
        value={content.text || ''}
        onChange={(e) => handleTextChange(e.target.value)}
        placeholder="Enter the text here. Use ___ to indicate where blanks should go."
        sx={{ mb: 3 }}
      />

      <Box sx={{ mb: 2 }}>
        <Button
          startIcon={<AddIcon />}
          onClick={handleAddBlank}
          variant="outlined"
        >
          Add Blank Space
        </Button>
      </Box>

      {(content.blanks || []).map((blank, blankIndex) => (
        <Paper key={blankIndex} sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mr: 2 }}>
              Blank #{blankIndex + 1}
            </Typography>
            <IconButton
              size="small"
              color="error"
              onClick={() => handleRemoveBlank(blankIndex)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>

          <TextField
            fullWidth
            label="Correct Answer"
            value={blank.correctAnswer}
            onChange={(e) => handleBlankChange(blankIndex, 'correctAnswer', e.target.value)}
            sx={{ mb: 2 }}
          />

          <Typography variant="subtitle2" gutterBottom>
            Alternative Answers:
          </Typography>

          {blank.alternatives.map((alt, altIndex) => (
            <Box key={altIndex} sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                fullWidth
                size="small"
                value={alt}
                onChange={(e) => handleAlternativeChange(blankIndex, altIndex, e.target.value)}
                placeholder={`Alternative ${altIndex + 1}`}
              />
              {blank.alternatives.length > 1 && (
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleRemoveAlternative(blankIndex, altIndex)}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          ))}

          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={() => handleAddAlternative(blankIndex)}
            sx={{ mt: 1 }}
          >
            Add Alternative
          </Button>
        </Paper>
      ))}
    </Box>
  );
};

export default FillBlankCreator;