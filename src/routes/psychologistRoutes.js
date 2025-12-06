const express = require('express');
const router = express.Router();

const {
  getAllPsychologists,
  getPsychologistById,
  createPsychologist,
  updatePsychologist,
  deletePsychologist,
  getAvailableTimes
} = require('../controllers/psychologistController');

const { authMiddleware, requireRole } = require('../middleware/authMiddleware');

// Listar psicólogos
router.get('/', getAllPsychologists);

// 🔥 Este orden es FUNDAMENTAL
router.get('/:id/available-times', getAvailableTimes);
router.get('/:id', getPsychologistById);

// CRUD Admin
router.post('/', authMiddleware, requireRole('ADMIN'), createPsychologist);
router.put('/:id', authMiddleware, requireRole('ADMIN'), updatePsychologist);
router.delete('/:id', authMiddleware, requireRole('ADMIN'), deletePsychologist);

module.exports = router;
