// src/controllers/lessonController.js
const Lesson = require('../models/Lesson');
const Exercise = require('../models/Exercise');

// Obter todas as lições
exports.getAllLessons = async (req, res) => {
  try {
    console.log('Buscando lições...'); // Debug
    const lessons = await Lesson.find()
      .select('title description level category duration isPublished')
      .sort('order');
    
    console.log('Lições encontradas:', lessons); // Debug
    res.json(lessons);
  } catch (error) {
    console.error('Erro ao buscar lições:', error);
    res.status(500).json({ message: error.message });
  }
};

// Obter lição por ID
exports.getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
      .populate('exercises');

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    res.json(lesson);
  } catch (error) {
    console.error('Erro ao buscar lição:', error);
    res.status(500).json({ message: error.message });
  }
};

// Criar lição
exports.createLesson = async (req, res) => {
  try {
    const {
      title,
      description,
      level,
      category,
      order,
      content,
      duration,
      isPublished,
      exercises
    } = req.body;

    // Primeiro criar a lição
    const lessonData = {
      title,
      description,
      level: Number(level),
      category,
      order: Number(order),
      content,
      duration: Number(duration),
      isPublished: Boolean(isPublished),
      exercises: []
    };

    const lesson = await Lesson.create(lessonData);

    // Depois criar os exercícios com a referência da lição
    const createdExercises = [];
    
    if (exercises && exercises.length > 0) {
      for (const exerciseData of exercises) {
        const exercise = {
          ...exerciseData,
          lessonId: lesson._id, // Adicionar o lessonId aqui
          points: Number(exerciseData.points),
          timeLimit: Number(exerciseData.timeLimit),
          order: Number(exerciseData.order)
        };

        const createdExercise = await Exercise.create(exercise);
        createdExercises.push(createdExercise._id);
      }
    }

    // Atualizar a lição com os exercícios criados
    lesson.exercises = createdExercises;
    await lesson.save();

    const populatedLesson = await Lesson.findById(lesson._id).populate('exercises');
    res.status(201).json(populatedLesson);
  } catch (error) {
    console.error('Erro ao criar lição:', error);
    res.status(500).json({ message: error.message, details: error.errors });
  }
};

// Iniciar lição
exports.startLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    res.json({ message: 'Lesson started successfully', lesson });
  } catch (error) {
    console.error('Erro ao iniciar lição:', error);
    res.status(500).json({ message: error.message });
  }
};

// Completar lição
exports.completeLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    res.json({ message: 'Lesson completed successfully' });
  } catch (error) {
    console.error('Erro ao completar lição:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = exports;