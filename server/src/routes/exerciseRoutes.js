const express = require('express');
const router = express.Router();
const { 
  submitAnswer, 
  getExerciseProgress 
} = require('../controllers/exerciseController');
const protect = require('../middleware/auth');

router.post('/:exerciseId/submit', protect, submitAnswer);
router.get('/:exerciseId/progress', protect, getExerciseProgress);

module.exports = router;