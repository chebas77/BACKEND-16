const express = require('express');
const router = express.Router();
const { register, login, me, logout } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);

// Obtener información del usuario a partir del token
router.get('/me', authMiddleware, me);

// Logout (simple, no borra nada en BD)
router.post('/logout', logout);

module.exports = router;