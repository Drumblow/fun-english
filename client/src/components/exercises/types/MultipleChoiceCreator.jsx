// src/components/exercises/types/MultipleChoiceCreator.jsx
import React from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  FormControlLabel,
  Checkbox,
  Button,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

const MultipleChoiceCreator = ({ content = { options: [] }, onChange }) => {
  const handleAddOption = () => {
    onChange({
      options: [...(content.options || []), { text: '', isCorrect: false }]
    });
  };

  const handleRemoveOption = (index) => {
    const newOptions = content.options.filter((_, i) => i !== index);
    onChange({
      ...content,
      options: newOptions
    });
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = content.options.map((option, i) => {
      if (i === index) {
        return { ...option, [field]: value };
      }
      return option;
    });
    onChange({
      ...content,
      options: newOptions
    });
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Answer Options
      </Typography>

      {(content.options || []).map((option, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 2
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={option.isCorrect}
                onChange={(e) => handleOptionChange(index, 'isCorrect', e.target.checked)}
                color="success"
              />
            }
            label="Correct"
          />
          
          <TextField
            fullWidth
            label={`Option ${index + 1}`}
            value={option.text}
            onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
          />
          
          {(content.options || []).length > 1 && (
            <IconButton
              color="error"
              onClick={() => handleRemoveOption(index)}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      ))}

      <Button
        startIcon={<AddIcon />}
        onClick={handleAddOption}
        variant="outlined"
        fullWidth
      >
        Add Option
      </Button>
    </Box>
  );
};

export default MultipleChoiceCreator;