// src/controllers/exerciseController.js

// Adicionar as importações necessárias
const Exercise = require('../models/Exercise');
const Progress = require('../models/Progress');
const User = require('../models/User');

// Funções auxiliares
const checkAnswer = async (exercise, answer) => {
  switch (exercise.type) {
    case 'multiple_choice':
      return checkMultipleChoice(exercise.content, answer);
    case 'fill_blank':
      return checkFillBlank(exercise.content, answer);
    case 'word_order':
      return checkWordOrder(exercise.content, answer);
    case 'matching':
      return checkMatching(exercise.content, answer);
    case 'audio_answer':
      return checkAudioAnswer(exercise.content, answer);
    default:
      throw new Error(`Unknown exercise type: ${exercise.type}`);
  }
};

const checkMultipleChoice = (content, answer) => {
  const correctOption = content.options.find(opt => opt.isCorrect);
  return {
    isCorrect: answer === correctOption.text,
    explanation: correctOption.explanation || 'Keep practicing!'
  };
};

const checkFillBlank = (content, answers) => {
  const isCorrect = content.blanks.every((blank, index) => {
    const userAnswer = answers[index]?.toLowerCase();
    return blank.correctAnswer.toLowerCase() === userAnswer ||
           blank.alternatives.some(alt => alt.toLowerCase() === userAnswer);
  });
  return {
    isCorrect,
    explanation: isCorrect ? null : 'Check your spelling and try again'
  };
};

const checkWordOrder = (content, answer) => {
  const normalizedAnswer = answer.map(word => word.toLowerCase());
  const normalizedCorrect = content.correctOrder.map(word => word.toLowerCase());
  const isCorrect = JSON.stringify(normalizedAnswer) === JSON.stringify(normalizedCorrect);
  return {
    isCorrect,
    explanation: isCorrect ? null : 'The word order is not correct'
  };
};

const checkMatching = (content, answers) => {
  const isCorrect = content.pairs.every(pair => {
    const userMatch = answers.find(a => a.left === pair.left);
    return userMatch && userMatch.right === pair.right;
  });
  return {
    isCorrect,
    explanation: isCorrect ? null : 'Some matches are incorrect'
  };
};

const checkAudioAnswer = (content, answer) => {
  const normalizedAnswer = answer.toLowerCase().trim();
  const isCorrect = content.acceptedTranscriptions.some(
    trans => trans.toLowerCase().trim() === normalizedAnswer
  );
  return {
    isCorrect,
    explanation: isCorrect ? null : 'Try listening again carefully'
  };
};

const calculateTimeBonus = (timeLimit, timeTaken) => {
  if (!timeTaken || timeTaken >= timeLimit) return 1;
  const timeRatio = timeTaken / timeLimit;
  return 1 + (0.2 * (1 - timeRatio));
};

// Controlador principal
const submitAnswer = async (req, res) => {
  try {
    const { exerciseId } = req.params;
    const { answer, timeTaken } = req.body;
    const userId = req.user.id;

    console.log('Submitting answer for exercise:', exerciseId);
    console.log('Answer:', answer);
    console.log('User:', userId);

    const exercise = await Exercise.findById(exerciseId);
    if (!exercise) {
      console.log('Exercise not found:', exerciseId);
      return res.status(404).json({ message: 'Exercise not found' });
    }

    console.log('Found exercise:', exercise);

    // Verificar a resposta e obter o resultado
    let answerResult;
    try {
      answerResult = await checkAnswer(exercise, answer);
      console.log('Answer check result:', answerResult);
    } catch (checkError) {
      console.error('Error checking answer:', checkError);
      return res.status(400).json({ message: 'Error validating answer' });
    }

    const { isCorrect, explanation } = answerResult;

    // Calcular pontuação
    const timeBonus = calculateTimeBonus(exercise.timeLimit, timeTaken);
    const baseScore = isCorrect ? exercise.points : 0;
    const finalScore = Math.round(baseScore * timeBonus);

    // Buscar ou criar progresso
    let progress = await Progress.findOne({
      userId,
      lessonId: exercise.lessonId
    });

    if (!progress) {
      progress = new Progress({
        userId,
        lessonId: exercise.lessonId,
        status: 'in_progress',
        startedAt: new Date(),
        exercises: []
      });
    }

    // Atualizar progresso do exercício
    let exerciseProgress = progress.exercises.find(
      ep => ep.exerciseId.toString() === exerciseId
    );

    if (exerciseProgress) {
      exerciseProgress.attempts.push({
        answer,
        isCorrect,
        score: finalScore,
        timeTaken
      });

      if (isCorrect && !exerciseProgress.completed) {
        exerciseProgress.completed = true;
        exerciseProgress.score = Math.max(exerciseProgress.score, finalScore);
      }
    } else {
      progress.exercises.push({
        exerciseId,
        attempts: [{
          answer,
          isCorrect,
          score: finalScore,
          timeTaken
        }],
        completed: isCorrect,
        score: finalScore
      });
    }

    // Atualizar estatísticas
    progress.totalScore = progress.exercises.reduce(
      (total, ex) => total + ex.score,
      0
    );

    progress.timeSpent = (progress.timeSpent || 0) + timeTaken;
    progress.lastAccessDate = new Date();

    await progress.save();

    res.json({
      isCorrect,
      explanation,
      score: finalScore,
      progress: {
        totalScore: progress.totalScore,
        accuracy: progress.accuracy,
        completed: progress.status === 'completed',
        percentComplete: progress.percentComplete
      }
    });
  } catch (error) {
    console.error('Exercise submission error:', error);
    res.status(500).json({ 
      message: 'Error submitting answer',
      details: error.message
    });
  }
};

const getExerciseProgress = async (req, res) => {
  try {
    const { exerciseId } = req.params;
    const userId = req.user.id;

    const exercise = await Exercise.findById(exerciseId);
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    const progress = await Progress.findOne({
      userId,
      'exercises.exerciseId': exerciseId
    });

    if (!progress) {
      return res.json({
        completed: false,
        attempts: 0,
        score: 0
      });
    }

    const exerciseProgress = progress.exercises.find(
      ep => ep.exerciseId.toString() === exerciseId
    );

    if (!exerciseProgress) {
      return res.json({
        completed: false,
        attempts: 0,
        score: 0
      });
    }

    res.json({
      completed: exerciseProgress.completed,
      attempts: exerciseProgress.attempts.length,
      score: exerciseProgress.score
    });
  } catch (error) {
    console.error('Error getting exercise progress:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitAnswer,
  getExerciseProgress
};