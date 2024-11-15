const Exercise = require('../models/Exercise');

const validateExerciseId = async (req, res, next) => {
  try {
    const { exerciseId } = req.params;
    
    if (!exerciseId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid exercise ID format' });
    }

    const exercise = await Exercise.findById(exerciseId);
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    req.exercise = exercise;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = validateExerciseId;
