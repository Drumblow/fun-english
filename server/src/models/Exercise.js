const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['multiple_choice', 'fill_blank', 'word_order', 'matching', 'audio_answer']
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  question: {
    type: String,
    required: true
  },
  instructions: {
    type: String,
    required: true
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  points: {
    type: Number,
    required: true,
    default: 10,
    min: 1
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard']
  },
  timeLimit: {
    type: Number,
    required: true,
    default: 60,
    min: 10
  },
  order: {
    type: Number,
    required: true,
    min: 1
  }
});

module.exports = mongoose.model('Exercise', exerciseSchema);