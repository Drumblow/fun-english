// src/models/Progress.js
const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'not_started'
  },
  startedAt: Date,
  completedAt: Date,
  exercises: [{
    exerciseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise'
    },
    attempts: [{
      answer: mongoose.Schema.Types.Mixed,
      isCorrect: Boolean,
      score: Number,
      timeTaken: Number,
      timestamp: {
        type: Date,
        default: Date.now
      }
    }],
    completed: {
      type: Boolean,
      default: false
    },
    score: {
      type: Number,
      default: 0
    }
  }],
  totalScore: {
    type: Number,
    default: 0
  },
  accuracy: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number, // em segundos
    default: 0
  },
  streakDays: {
    type: Number,
    default: 0
  },
  lastAccessDate: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtuals
progressSchema.virtual('percentComplete').get(function() {
  if (!this.exercises.length) return 0;
  const completed = this.exercises.filter(ex => ex.completed).length;
  return (completed / this.exercises.length) * 100;
});

progressSchema.virtual('averageScore').get(function() {
  if (!this.exercises.length) return 0;
  return this.totalScore / this.exercises.length;
});

module.exports = mongoose.model('Progress', progressSchema);