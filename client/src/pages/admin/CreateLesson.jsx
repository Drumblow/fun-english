import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  Grid,
  Box,
  Snackbar,
  Alert,
} from '@mui/material';
import api from '../../services/api';

const categories = [
  'Grammar',
  'Vocabulary',
  'Conversation',
  'Reading',
  'Listening'
];

const CreateLesson = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: 1,
    category: '',
    order: 1,
    content: {
      theory: '',
      examples: ['']
    },
    duration: 30,
    isPublished: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleExampleChange = (index, value) => {
    const newExamples = [...formData.content.examples];
    newExamples[index] = value;
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        examples: newExamples
      }
    }));
  };

  const addExample = () => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        examples: [...prev.content.examples, '']
      }
    }));
  };

  const removeExample = (index) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        examples: prev.content.examples.filter((_, i) => i !== index)
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post('/lessons', formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/lessons');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating lesson');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Lesson
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                multiline
                rows={3}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Level"
                name="level"
                type="number"
                value={formData.level}
                onChange={handleChange}
                required
                inputProps={{ min: 1, max: 10 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Order"
                name="order"
                type="number"
                value={formData.order}
                onChange={handleChange}
                required
                inputProps={{ min: 1 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration (minutes)"
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleChange}
                required
                inputProps={{ min: 5 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Theory Content"
                name="content.theory"
                value={formData.content.theory}
                onChange={handleChange}
                required
                multiline
                rows={6}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Examples
              </Typography>
              {formData.content.examples.map((example, index) => (
                <Box key={index} sx={{ mb: 2, display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    label={`Example ${index + 1}`}
                    value={example}
                    onChange={(e) => handleExampleChange(index, e.target.value)}
                    required
                  />
                  {index > 0 && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => removeExample(index)}
                    >
                      Remove
                    </Button>
                  )}
                </Box>
              ))}
              <Button onClick={addExample} variant="outlined">
                Add Example
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate('/admin/lessons')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Lesson'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar open={success} autoHideDuration={6000}>
        <Alert severity="success" sx={{ width: '100%' }}>
          Lesson created successfully!
        </Alert>
      </Snackbar>

      <Snackbar open={!!error} autoHideDuration={6000}>
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateLesson;