const express = require("express");
const router = express.Router();
const {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
  getPsychologistAppointments,
  updateAppointment,
  cancelAppointment,
  deleteAppointment
} = require("../controllers/appointmentController");

const { authMiddleware, requireRole } = require("../middleware/authMiddleware");

// Crear cita (usuario autenticado)
router.post("/", authMiddleware, createAppointment);

// Mis citas (usuario autenticado)
router.get("/mine", authMiddleware, getMyAppointments);

// TODAS las citas (ADMIN ONLY)
router.get("/admin/all", authMiddleware, requireRole('ADMIN'), getAllAppointments);

// Listar citas de un psicólogo (ADMIN ONLY)
router.get("/psychologist/:id", authMiddleware, requireRole('ADMIN'), getPsychologistAppointments);

// Actualizar cita (usuario autenticado)
router.put("/:id", authMiddleware, updateAppointment);

// Cancelar cita (usuario autenticado)
router.patch("/:id/cancel", authMiddleware, cancelAppointment);

// Eliminar cita (usuario autenticado)
router.delete("/:id", authMiddleware, deleteAppointment);

module.exports = router;