// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
      console.log('Token encontrado no header'); // Debug
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decodificado:', decoded); // Debug

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');
      console.log('Usuário autenticado:', req.user); // Debug

      next();
    } else {
      console.log('Token não encontrado'); // Debug
      res.status(401).json({ message: 'Not authorized, no token' });
    }
  } catch (error) {
    console.error('Erro na autenticação:', error);
    res.status(401).json({ message: 'Not authorized' });
  }
};

module.exports = protect;