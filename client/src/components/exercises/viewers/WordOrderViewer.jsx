import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableChip = ({ id, word, color, variant }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Box ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Chip
        label={word}
        color={color}
        variant={variant}
        sx={{ m: 0.5 }}
      />
    </Box>
  );
};

const WordOrderViewer = ({ content, onChange, value, disabled, feedback }) => {
  const [words, setWords] = useState([]);
  const [orderedWords, setOrderedWords] = useState([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (content?.words?.length > 0) {
      const wordObjects = content.words.map((word, index) => ({
        id: `word-${index}`,
        content: word
      }));
      setWords(wordObjects);
    }
  }, [content?.words]);

  useEffect(() => {
    if (value) {
      const valueObjects = value.map((word, index) => ({
        id: `ordered-${index}`,
        content: word
      }));
      setOrderedWords(valueObjects);
    }
  }, [value]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = orderedWords.findIndex((item) => item.id === active.id);
      const newIndex = orderedWords.findIndex((item) => item.id === over.id);
      
      const newOrderedWords = arrayMove(orderedWords, oldIndex, newIndex);
      setOrderedWords(newOrderedWords);
      onChange(newOrderedWords.map(w => w.content));
    }
  };

  const handleAddWord = (wordObj) => {
    if (!orderedWords.find(w => w.id === wordObj.id)) {
      const newWord = { ...wordObj, id: `ordered-${orderedWords.length}` };
      const newOrderedWords = [...orderedWords, newWord];
      setOrderedWords(newOrderedWords);
      onChange(newOrderedWords.map(w => w.content));
      setWords(words.filter(w => w.id !== wordObj.id));
    }
  };

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Available Words:
      </Typography>
      <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.100' }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {words.map((word) => (
            <Chip
              key={word.id}
              label={word.content}
              onClick={() => !disabled && handleAddWord(word)}
              sx={{ m: 0.5 }}
              variant="outlined"
            />
          ))}
        </Box>
      </Paper>

      <Typography variant="subtitle1" gutterBottom>
        Your Answer:
      </Typography>
      <Paper sx={{ p: 2, bgcolor: feedback ? 'grey.100' : 'primary.50' }}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          disabled={disabled}
        >
          <SortableContext
            items={orderedWords}
            strategy={horizontalListSortingStrategy}
          >
            <Box sx={{ display: 'flex', flexWrap: 'wrap', minHeight: 50 }}>
              {orderedWords.map((word, index) => (
                <SortableChip
                  key={word.id}
                  id={word.id}
                  word={word.content}
                  color={
                    feedback
                      ? word.content === content?.correctOrder?.[index]
                        ? 'success'
                        : 'error'
                      : 'primary'
                  }
                  variant={feedback ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
          </SortableContext>
        </DndContext>
      </Paper>

      {feedback && !feedback.isCorrect && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" color="error.main" gutterBottom>
            Correct order:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {content.correctOrder.map((word, index) => (
              <Chip
                key={`correct-${index}`}
                label={word}
                color="success"
                variant="outlined"
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default WordOrderViewer;