// src/models/Lesson.js
const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  category: {
    type: String,
    required: true,
    enum: ['Grammar', 'Vocabulary', 'Conversation', 'Reading', 'Listening']
  },
  order: {
    type: Number,
    required: true
  },
  content: {
    theory: {
      type: String,
      required: true
    },
    examples: [{
      type: String
    }]
  },
  exercises: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise'
  }],
  duration: {
    type: Number,
    required: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Lesson', lessonSchema);