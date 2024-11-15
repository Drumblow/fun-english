// src/components/exercises/types/MatchingCreator.jsx
import React from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Paper,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

const MatchingCreator = ({ content, onChange }) => {
  const handleAddPair = () => {
    onChange({
      ...content,
      pairs: [...(content.pairs || []), { left: '', right: '' }]
    });
  };

  const handleRemovePair = (index) => {
    const newPairs = content.pairs.filter((_, i) => i !== index);
    onChange({
      ...content,
      pairs: newPairs
    });
  };

  const handlePairChange = (index, side, value) => {
    const newPairs = content.pairs.map((pair, i) => {
      if (i === index) {
        return { ...pair, [side]: value };
      }
      return pair;
    });
    onChange({
      ...content,
      pairs: newPairs
    });
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Matching Pairs
      </Typography>

      {(content.pairs || []).map((pair, index) => (
        <Paper key={index} sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle2">
              Pair #{index + 1}
            </Typography>
            <IconButton
              size="small"
              color="error"
              onClick={() => handleRemovePair(index)}
              sx={{ ml: 'auto' }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Left Side"
                value={pair.left}
                onChange={(e) => handlePairChange(index, 'left', e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Right Side"
                value={pair.right}
                onChange={(e) => handlePairChange(index, 'right', e.target.value)}
              />
            </Grid>
          </Grid>
        </Paper>
      ))}

      <Button
        startIcon={<AddIcon />}
        onClick={handleAddPair}
        variant="outlined"
        fullWidth
      >
        Add Matching Pair
      </Button>
    </Box>
  );
};

export default MatchingCreator;