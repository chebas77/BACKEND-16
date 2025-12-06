const express = require("express");
const router = express.Router();
const {
  createAppointment,
  getMyAppointments,
  getPsychologistAppointments,
  updateAppointment,
  cancelAppointment,
  deleteAppointment
} = require("../controllers/appointmentController");

const { authMiddleware } = require("../middleware/authMiddleware");

// Crear cita
router.post("/", authMiddleware, createAppointment);

// Mis citas
router.get("/mine", authMiddleware, getMyAppointments);

// Listar citas de un psicólogo
router.get("/psychologist/:id", authMiddleware, getPsychologistAppointments);

// Actualizar cita
router.put("/:id", authMiddleware, updateAppointment);

// Cancelar cita
router.patch("/:id/cancel", authMiddleware, cancelAppointment);

// Eliminar cita
router.delete("/:id", authMiddleware, deleteAppointment);

module.exports = router;
