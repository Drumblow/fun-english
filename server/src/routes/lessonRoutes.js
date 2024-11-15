// src/routes/lessonRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllLessons,
  getLessonById,
  createLesson,
  startLesson,
  completeLesson
} = require('../controllers/lessonController');
const protect = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// Rotas públicas
router.get('/', getAllLessons);
router.get('/:id', getLessonById);

// Rotas protegidas
router.post('/', protect, checkRole(['teacher', 'admin']), createLesson);
router.post('/:id/start', protect, startLesson);
router.post('/:id/complete', protect, completeLesson);

module.exports = router;