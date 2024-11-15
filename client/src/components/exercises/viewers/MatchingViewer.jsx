import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  MenuItem,
  TextField,
  Grid,
  Chip,
} from '@mui/material';

const MatchingViewer = ({ content, onChange, value, disabled, feedback }) => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    if (!value) {
      setMatches(content.pairs.map((pair, index) => ({
        id: `match-${index}`,
        left: pair.left,
        right: ''
      })));
    } else {
      setMatches(value.map((match, index) => ({
        ...match,
        id: `match-${index}`
      })));
    }
  }, [content.pairs, value]);

  const handleMatch = (matchId, rightValue) => {
    const newMatches = matches.map(match => ({
      ...match,
      right: match.id === matchId ? rightValue : match.right
    }));
    setMatches(newMatches);
    onChange(newMatches);
  };

  const getAvailableRightItems = (currentMatch) => {
    const usedItems = matches
      .filter(match => match.id !== currentMatch.id && match.right)
      .map(match => match.right);
    
    const allRightItems = content.pairs.map(pair => pair.right);
    
    return [...new Set([
      currentMatch.right,
      ...allRightItems.filter(item => !usedItems.includes(item))
    ])].filter(Boolean);
  };

  const getMatchStatus = (match) => {
    if (!feedback || !match.right) return 'default';

    const correctPair = content.pairs.find(pair => pair.left === match.left);
    return correctPair?.right === match.right ? 'success' : 'error';
  };

  const areAllMatchesCorrect = () => {
    return matches.every(match => {
      const correctPair = content.pairs.find(pair => pair.left === match.left);
      return correctPair?.right === match.right;
    });
  };

  useEffect(() => {
    if (feedback) {
      const allCorrect = areAllMatchesCorrect();
      if (allCorrect !== feedback.isCorrect) {
        onChange(matches);
      }
    }
  }, [feedback]);

  return (
    <Box>
      <Grid container spacing={3}>
        {matches.map((match) => (
          <Grid item xs={12} key={match.id}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                bgcolor: feedback && getMatchStatus(match) === 'success' ? 'success.50' : 'background.paper',
                borderLeft: 4,
                borderColor: `${getMatchStatus(match)}.main`
              }}
            >
              <Box flexGrow={1}>
                <Typography variant="body1">
                  {match.left}
                </Typography>
              </Box>

              <Box sx={{ minWidth: 200 }}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  id={`match-select-${match.id}`}
                  name={`match-${match.id}`}
                  value={match.right}
                  onChange={(e) => handleMatch(match.id, e.target.value)}
                  disabled={disabled}
                  error={feedback && getMatchStatus(match) === 'error'}
                  autoComplete="off"
                >
                  <MenuItem value="">
                    <em>Select a match</em>
                  </MenuItem>
                  {getAvailableRightItems(match).map((item) => (
                    <MenuItem key={`${match.id}-${item}`} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {feedback && !feedback.isCorrect && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" color="error.main" gutterBottom>
            Correct matches:
          </Typography>
          <Grid container spacing={2}>
            {content.pairs.map((pair, index) => (
              <Grid item xs={12} key={`correct-${index}`}>
                <Paper sx={{ p: 2, bgcolor: 'success.50' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip label={pair.left} color="primary" />
                    <Typography sx={{ mx: 2 }}>→</Typography>
                    <Chip label={pair.right} color="success" />
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default MatchingViewer;