const mongoose = require('mongoose');

// Import all models
const User = require('./User');
const Lesson = require('./Lesson');
const Exercise = require('./Exercise');
const Progress = require('./Progress');

// Register models
mongoose.model('User', User.schema);
mongoose.model('Lesson', Lesson.schema);
mongoose.model('Exercise', Exercise.schema);
mongoose.model('Progress', Progress.schema);

// Export models
module.exports = {
  User,
  Lesson,
  Exercise,
  Progress
};