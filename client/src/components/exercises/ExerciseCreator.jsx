import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Alert,
  Collapse,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import MultipleChoiceCreator from './types/MultipleChoiceCreator';
import FillBlankCreator from './types/FillBlankCreator';
import WordOrderCreator from './types/WordOrderCreator';
import MatchingCreator from './types/MatchingCreator';
import AudioAnswerCreator from './types/AudioAnswerCreator';

const exerciseTypes = [
  { value: 'multiple_choice', label: 'Multiple Choice' },
  { value: 'fill_blank', label: 'Fill in the Blanks' },
  { value: 'word_order', label: 'Word Order' },
  { value: 'matching', label: 'Matching' },
  { value: 'audio_answer', label: 'Audio Answer' },
];

const difficultyLevels = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

const getInitialContentForType = (type) => {
  switch (type) {
    case 'multiple_choice':
      return { options: [{ text: '', isCorrect: false }] };
    case 'fill_blank':
      return { text: '', blanks: [] };
    case 'word_order':
      return { words: [], correctOrder: [] };
    case 'matching':
      return { pairs: [{ left: '', right: '' }] };
    case 'audio_answer':
      return { audioUrl: '', acceptedTranscriptions: [''] };
    default:
      return {};
  }
};

const ExerciseCreator = ({ exercises = [], onChange, maxExercises = 10 }) => {
  const [currentExercise, setCurrentExercise] = useState({
    type: 'multiple_choice',
    question: '',
    instructions: '',
    difficulty: 'medium',
    points: 10,
    timeLimit: 60,
    content: getInitialContentForType('multiple_choice')
  });

  const [validationError, setValidationError] = useState(null);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);

  const validateExercise = () => {
    if (!currentExercise.question.trim()) {
      return 'Question is required';
    }
    if (!currentExercise.instructions.trim()) {
      return 'Instructions are required';
    }
    if (currentExercise.points < 1) {
      return 'Points must be greater than 0';
    }
    if (currentExercise.timeLimit < 10) {
      return 'Time limit must be at least 10 seconds';
    }

    // Validações específicas por tipo
    switch (currentExercise.type) {
      case 'multiple_choice': {
        const { options } = currentExercise.content;
        if (!options || options.length < 2) {
          return 'At least 2 options are required';
        }
        if (!options.some(opt => opt.isCorrect)) {
          return 'At least one correct option is required';
        }
        if (options.some(opt => !opt.text.trim())) {
          return 'All options must have text';
        }
        break;
      }
      case 'fill_blank': {
        const { text, blanks } = currentExercise.content;
        if (!text.trim()) {
          return 'Text is required';
        }
        if (!blanks || blanks.length === 0) {
          return 'At least one blank is required';
        }
        if (blanks.some(blank => !blank.correctAnswer.trim())) {
          return 'All blanks must have a correct answer';
        }
        break;
      }
      case 'word_order': {
        const { words, correctOrder } = currentExercise.content;
        if (!words || words.length < 2) {
          return 'At least 2 words are required';
        }
        if (!correctOrder || correctOrder.length !== words.length) {
          return 'Correct order must contain all words';
        }
        break;
      }
      case 'matching': {
        const { pairs } = currentExercise.content;
        if (!pairs || pairs.length < 2) {
          return 'At least 2 pairs are required';
        }
        if (pairs.some(pair => !pair.left.trim() || !pair.right.trim())) {
          return 'All pairs must have both left and right values';
        }
        break;
      }
      case 'audio_answer': {
        const { audioUrl, acceptedTranscriptions } = currentExercise.content;
        if (!audioUrl.trim()) {
          return 'Audio URL is required';
        }
        if (!acceptedTranscriptions || !acceptedTranscriptions.some(t => t.trim())) {
          return 'At least one accepted transcription is required';
        }
        break;
      }
    }

    return null;
  };

  const checkDuplicate = () => {
    return exercises.some(ex => 
      ex.question.toLowerCase() === currentExercise.question.toLowerCase() &&
      ex.type === currentExercise.type
    );
  };

  const handleExerciseTypeChange = (e) => {
    const type = e.target.value;
    setCurrentExercise(prev => ({
      ...prev,
      type,
      content: getInitialContentForType(type)
    }));
    setValidationError(null);
    setShowDuplicateWarning(false);
  };

  const handleContentChange = (content) => {
    setCurrentExercise(prev => ({
      ...prev,
      content
    }));
    setValidationError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentExercise(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'question') {
      setShowDuplicateWarning(checkDuplicate());
    }
    setValidationError(null);
  };

  const resetExercise = () => {
    setCurrentExercise({
      type: 'multiple_choice',
      question: '',
      instructions: '',
      difficulty: 'medium',
      points: 10,
      timeLimit: 60,
      content: getInitialContentForType('multiple_choice')
    });
    setValidationError(null);
    setShowDuplicateWarning(false);
  };

  const handleAddExercise = () => {
    const error = validateExercise();
    if (error) {
      setValidationError(error);
      return;
    }

    const isDuplicate = checkDuplicate();
    if (isDuplicate) {
      setShowDuplicateWarning(true);
      return;
    }

    if (exercises.length >= maxExercises) {
      setValidationError(`Maximum of ${maxExercises} exercises allowed`);
      return;
    }

    const newExercise = {
      ...currentExercise,
      order: exercises.length + 1
    };

    onChange([...exercises, newExercise]);
    resetExercise();
  };

  const handleRemoveExercise = (index) => {
    const updatedExercises = exercises.filter((_, i) => i !== index);
    onChange(updatedExercises.map((ex, i) => ({ ...ex, order: i + 1 })));
  };

  const renderExerciseContent = () => {
    const componentProps = {
      content: currentExercise.content || getInitialContentForType(currentExercise.type),
      onChange: handleContentChange
    };
  
    switch (currentExercise.type) {
      case 'multiple_choice':
        return <MultipleChoiceCreator {...componentProps} />;
      case 'fill_blank':
        return <FillBlankCreator {...componentProps} />;
      case 'word_order':
        return <WordOrderCreator {...componentProps} />;
      case 'matching':
        return <MatchingCreator {...componentProps} />;
      case 'audio_answer':
        return <AudioAnswerCreator {...componentProps} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Exercises ({exercises.length}/{maxExercises})
      </Typography>

      {exercises.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            Created Exercises:
          </Typography>
          {exercises.map((exercise, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="subtitle2">
                      {index + 1}. {exercise.question}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {exercise.type} • {exercise.difficulty} • {exercise.points} points • {exercise.timeLimit}s
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleRemoveExercise(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Exercise Type"
                value={currentExercise.type}
                onChange={handleExerciseTypeChange}
              >
                {exerciseTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Difficulty"
                name="difficulty"
                value={currentExercise.difficulty}
                onChange={handleInputChange}
              >
                {difficultyLevels.map((level) => (
                  <MenuItem key={level.value} value={level.value}>
                    {level.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Question"
                name="question"
                value={currentExercise.question}
                onChange={handleInputChange}
                error={showDuplicateWarning}
                helperText={showDuplicateWarning ? 'This question already exists' : ''}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Instructions"
                name="instructions"
                value={currentExercise.instructions}
                onChange={handleInputChange}
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Points"
                name="points"
                value={currentExercise.points}
                onChange={handleInputChange}
                inputProps={{ min: 1 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Time Limit (seconds)"
                name="timeLimit"
                value={currentExercise.timeLimit}
                onChange={handleInputChange}
                inputProps={{ min: 10 }}
              />
            </Grid>

            <Grid item xs={12}>
              {/* Componente específico para o tipo de exercício */}
              {renderExerciseContent()}
            </Grid>

            {validationError && (
              <Grid item xs={12}>
                <Alert severity="error" icon={<WarningIcon />}>
                  {validationError}
                </Alert>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddExercise}
                fullWidth
                disabled={!!validationError || exercises.length >= maxExercises}
              >
                Add Exercise
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ExerciseCreator;