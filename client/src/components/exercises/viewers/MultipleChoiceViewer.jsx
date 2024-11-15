// src/components/exercises/viewers/MultipleChoiceViewer.jsx
import React from 'react';
import {
  Box,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
} from '@mui/material';

const MultipleChoiceViewer = ({ content, onChange, value, disabled, feedback }) => {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  const getOptionColor = (option) => {
    if (!feedback) return 'default';
    
    if (feedback.isCorrect && value === option.text) {
      return 'success';
    }
    
    if (!feedback.isCorrect) {
      if (value === option.text) {
        return 'error';
      }
      if (option.isCorrect) {
        return 'success';
      }
    }
    
    return 'default';
  };

  return (
    <FormControl component="fieldset" disabled={disabled}>
      <RadioGroup
        value={value || ''}
        onChange={handleChange}
      >
        {content.options.map((option, index) => (
          <Paper
            key={index}
            sx={{
              mb: 1,
              p: 1,
              border: 2,
              borderColor: getOptionColor(option) + '.main',
              borderStyle: feedback && option.isCorrect ? 'solid' : 'none',
              bgcolor: feedback && value === option.text ? `${getOptionColor(option)}.50` : 'background.paper'
            }}
          >
            <FormControlLabel
              value={option.text}
              control={
                <Radio
                  color={getOptionColor(option)}
                />
              }
              label={option.text}
              sx={{
                width: '100%',
                m: 0,
                '& .MuiFormControlLabel-label': {
                  flex: 1,
                  ml: 1
                }
              }}
            />
          </Paper>
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default MultipleChoiceViewer;