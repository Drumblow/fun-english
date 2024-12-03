import React from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
} from '@mui/icons-material';

const WordOrderCreator = ({ content, onChange }) => {
  const [newWord, setNewWord] = React.useState('');

  const handleAddWord = () => {
    if (newWord.trim()) {
      const newWords = [...(content.words || []), newWord.trim()];
      onChange({
        ...content,
        words: newWords,
        correctOrder: [...newWords] 
      });
      setNewWord('');
    }
  };

  const handleRemoveWord = (index) => {
    const newWords = content.words.filter((_, i) => i !== index);
    const newCorrectOrder = content.correctOrder.filter(word => newWords.includes(word));
    onChange({
      ...content,
      words: newWords,
      correctOrder: newCorrectOrder
    });
  };

  const handleMoveWord = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= content.correctOrder.length) return;

    const newOrder = [...content.correctOrder];
    const [movedWord] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedWord);

    onChange({
      ...content,
      correctOrder: newOrder
    });
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Word Order Exercise
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <TextField
          fullWidth
          label="Add Word"
          value={newWord}
          onChange={(e) => setNewWord(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleAddWord();
            }
          }}
        />
        <Button
          variant="contained"
          onClick={handleAddWord}
          disabled={!newWord.trim()}
        >
          <AddIcon />
        </Button>
      </Box>

      {content.words?.length > 0 && (
        <>
          <Typography variant="subtitle2" gutterBottom>
            Words:
          </Typography>
          <Paper sx={{ mb: 3 }}>
            <List dense>
              {content.words.map((word, index) => (
                <ListItem key={index}>
                  <ListItemText primary={word} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => handleRemoveWord(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>

          <Typography variant="subtitle2" gutterBottom>
            Correct Order (drag to reorder):
          </Typography>
          <Paper>
            <List dense>
              {content.correctOrder?.map((word, index) => (
                <ListItem key={index}>
                  <IconButton
                    size="small"
                    onClick={() => handleMoveWord(index, index - 1)}
                    disabled={index === 0}
                  >
                    ↑
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleMoveWord(index, index + 1)}
                    disabled={index === content.correctOrder.length - 1}
                  >
                    ↓
                  </IconButton>
                  <ListItemText primary={word} sx={{ ml: 1 }} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default WordOrderCreator;