import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  Paper,
} from '@mui/material';

const FillBlankViewer = ({ content, onChange, value, disabled, feedback }) => {
  const [answers, setAnswers] = useState(Array(content.blanks.length).fill(''));

  useEffect(() => {
    if (value) {
      setAnswers(value);
    }
  }, [value]);

  useEffect(() => {
    onChange(answers);
  }, [answers]);

  const handleAnswerChange = (index, newValue) => {
    const newAnswers = [...answers];
    newAnswers[index] = newValue;
    setAnswers(newAnswers);
  };

  const renderText = () => {
    const parts = content.text.split('___');
    return parts.map((part, index) => {
      const isLast = index === parts.length - 1;
      const blank = content.blanks[index];
      const currentAnswer = answers[index] || '';
      
      let textColor = 'text.primary';
      let backgroundColor = 'background.paper';
      
      if (feedback && !isLast) {
        const isCorrect = blank.correctAnswer === currentAnswer || 
                         blank.alternatives.includes(currentAnswer);
        
        if (isCorrect) {
          textColor = 'success.main';
          backgroundColor = 'success.50';
        } else {
          textColor = 'error.main';
          backgroundColor = 'error.50';
        }
      }

      return (
        <React.Fragment key={index}>
          <Typography component="span">
            {part}
          </Typography>
          {!isLast && (
            <TextField
              variant="outlined"
              size="small"
              value={currentAnswer}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              disabled={disabled}
              sx={{
                width: '120px',
                mx: 1,
                '& .MuiInputBase-input': {
                  color: textColor,
                  backgroundColor,
                },
              }}
            />
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ 
        lineHeight: 2.5,
        '& .MuiTextField-root': {
          mx: 1,
          display: 'inline-flex',
          verticalAlign: 'middle',
        }
      }}>
        {renderText()}
      </Box>

      {feedback && !feedback.isCorrect && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" color="error.main" gutterBottom>
            Correct answers:
          </Typography>
          {content.blanks.map((blank, index) => (
            <Typography key={index} variant="body2" color="text.secondary">
              Blank {index + 1}: {blank.correctAnswer} 
              {blank.alternatives.length > 0 && ` (or: ${blank.alternatives.join(', ')})`}
            </Typography>
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default FillBlankViewer;