const { Appointment, Psychologist, User } = require("../models");
const { Op } = require("sequelize");

// =========================
// 🔥 Validaciones Helper
// =========================

// Validar que no exista otra cita misma fecha+hora+psicólogo
async function checkDoubleBooking(psychologistId, date, time) {
  return await Appointment.findOne({
    where: { psychologistId, date, time }
  });
}

// Validar fecha futura
function isFutureDate(date) {
  const today = new Date().setHours(0, 0, 0, 0);
  const input = new Date(date).setHours(0, 0, 0, 0);
  return input >= today;
}

// =========================
// 1. CREAR CITA
// =========================
const createAppointment = async (req, res) => {
  try {
    const { psychologistId, date, time } = req.body;

    // 1. Fecha futura
    if (!isFutureDate(date)) {
      return res.status(400).json({ message: "La fecha debe ser futura" });
    }

    // 2. Validar psicólogo
    const psychologist = await Psychologist.findByPk(psychologistId);
    if (!psychologist) {
      return res.status(400).json({ message: "Psicólogo no encontrado" });
    }

    // 3. Validar que el psicólogo trabaje ese día
    const dayName = new Date(date)
      .toLocaleString("en-US", { weekday: "long" })
      .toLowerCase();

    if (!psychologist.availability[dayName]) {
      return res.status(400).json({
        message: `El psicólogo no atiende los días ${dayName}`
      });
    }

    // 4. Validar horario permitido
    const hour = parseInt(time.split(":")[0], 10);
    if (hour < 8 || hour > 20) {
      return res.status(400).json({
        message: "Horario no permitido (08:00 - 20:00)"
      });
    }

    // 5. Validar que ese horario NO esté ocupado
    const exists = await checkDoubleBooking(psychologistId, date, time);
    if (exists) {
      return res.status(400).json({
        message: "Ese horario ya está ocupado por otra cita"
      });
    }

    // 6. Validar que el usuario no reserve 2 veces el mismo día
    const sameDay = await Appointment.findOne({
      where: {
        patientId: req.user.id,
        date
      }
    });

    if (sameDay) {
      return res.status(400).json({
        message: "Ya tienes una cita registrada para ese día"
      });
    }

    // 7. Crear cita
    const appointment = await Appointment.create({
      psychologistId,
      patientId: req.user.id,
      date,
      time
    });

    res.status(201).json({
      message: "Cita creada correctamente",
      appointment
    });

  } catch (err) {
    console.error("Error createAppointment:", err);
    res.status(500).json({ message: "Error al crear cita" });
  }
};

// =========================
// 2. LISTAR MIS CITAS
// =========================
const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: { patientId: req.user.id },
      include: [{ model: Psychologist }]
    });

    res.json(appointments);
  } catch (err) {
    console.error("Error getMyAppointments:", err);
    res.status(500).json({ message: "Error al listar citas" });
  }
};

// =========================
// 2.5 LISTAR TODAS LAS CITAS (ADMIN ONLY)
// =========================
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      include: [
        { model: User, as: "patient", attributes: ["id", "fullName", "email"] },
        { model: Psychologist, attributes: ["id", "fullName", "specialty"] }
      ],
      order: [["date", "DESC"], ["time", "DESC"]]
    });

    res.json(appointments);
  } catch (err) {
    console.error("Error getAllAppointments:", err);
    res.status(500).json({ message: "Error al listar todas las citas" });
  }
};

// =========================
// 3. LISTAR CITAS DE UN PSICÓLOGO (ADMIN)
// =========================
const getPsychologistAppointments = async (req, res) => {
  try {
    const psychologistId = req.params.id;

    const appointments = await Appointment.findAll({
      where: { psychologistId },
      include: [
        { model: User, as: "patient", attributes: ["id", "fullName", "email"] }
      ]
    });

    res.json(appointments);
  } catch (err) {
    console.error("Error getPsychologistAppointments:", err);
    res.status(500).json({ message: "Error al obtener citas del psicólogo" });
  }
};

// =========================
// 4. ACTUALIZAR CITA
// =========================
const updateAppointment = async (req, res) => {
  try {
    const id = req.params.id;
    const { date, time, psychologistId } = req.body;

    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    if (appointment.patientId !== req.user.id) {
      return res.status(403).json({
        message: "No puedes modificar esta cita"
      });
    }

    if (date && !isFutureDate(date)) {
      return res.status(400).json({ message: "Fecha inválida" });
    }

    if (psychologistId) {
      const exists = await Psychologist.findByPk(psychologistId);
      if (!exists) return res.status(400).json({ message: "Psicólogo no válido" });
    }

    const double = await checkDoubleBooking(
      psychologistId ?? appointment.psychologistId,
      date ?? appointment.date,
      time ?? appointment.time
    );

    if (double && double.id !== appointment.id) {
      return res.status(400).json({ message: "Horario ocupado" });
    }

    appointment.date = date ?? appointment.date;
    appointment.time = time ?? appointment.time;
    appointment.psychologistId = psychologistId ?? appointment.psychologistId;

    await appointment.save();

    res.json({ message: "Cita actualizada", appointment });

  } catch (err) {
    console.error("Error updateAppointment:", err);
    res.status(500).json({ message: "Error al actualizar cita" });
  }
};

// =========================
// 5. CANCELAR CITA
// =========================
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);

    if (!appointment) return res.status(404).json({ message: "Cita no encontrada" });
    if (appointment.patientId !== req.user.id)
      return res.status(403).json({ message: "No puedes cancelar esta cita" });

    appointment.status = "CANCELLED";
    await appointment.save();

    res.json({ message: "Cita cancelada", appointment });

  } catch (err) {
    console.error("Error cancelAppointment:", err);
    res.status(500).json({ message: "Error al cancelar cita" });
  }
};

// =========================
// 6. ELIMINAR CITA
// =========================
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);

    if (!appointment) return res.status(404).json({ message: "Cita no encontrada" });
    if (appointment.patientId !== req.user.id)
      return res.status(403).json({ message: "No puedes eliminar esta cita" });

    await appointment.destroy();

    res.json({ message: "Cita eliminada" });

  } catch (err) {
    console.error("Error deleteAppointment:", err);
    res.status(500).json({ message: "Error al eliminar cita" });
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
  getPsychologistAppointments,
  updateAppointment,
  cancelAppointment,
  deleteAppointment
};