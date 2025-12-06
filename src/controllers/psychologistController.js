const { Psychologist, Appointment } = require('../models');

// =========================
// LISTAR PSICÓLOGOS
// =========================
const getAllPsychologists = async (req, res) => {
  try {
    const list = await Psychologist.findAll();
    res.json(list);
  } catch (err) {
    console.error('Error getAllPsychologists:', err);
    res.status(500).json({ message: 'Error al listar psicólogos' });
  }
};

// =========================
// OBTENER PSICÓLOGO POR ID
// =========================
const getPsychologistById = async (req, res) => {
  try {
    const { id } = req.params;
    const psy = await Psychologist.findByPk(id);

    if (!psy)
      return res.status(404).json({ message: "Psicólogo no encontrado" });

    res.json(psy);

  } catch (err) {
    console.error('Error getPsychologistById:', err);
    res.status(500).json({ message: 'Error al obtener psicólogo' });
  }
};

// =========================
// CREAR PSICÓLOGO
// =========================
const createPsychologist = async (req, res) => {
  try {
    const { fullName, specialty, description, email, phone, availability } = req.body;

    const exists = await Psychologist.findOne({ where: { email } });
    if (exists) return res.status(400).json({ message: "El email ya está registrado" });

    const psy = await Psychologist.create({
      fullName,
      specialty,
      description,
      email,
      phone,
      availability
    });

    res.status(201).json({ message: "Psicólogo creado", psy });
  } catch (err) {
    console.error('Error createPsychologist:', err);
    res.status(500).json({ message: 'Error al crear psicólogo' });
  }
};

// =========================
// ACTUALIZAR PSICÓLOGO
// =========================
const updatePsychologist = async (req, res) => {
  try {
    const { id } = req.params;

    const psy = await Psychologist.findByPk(id);
    if (!psy) return res.status(404).json({ message: "Psicólogo no encontrado" });

    await psy.update(req.body);

    res.json({ message: "Psicólogo actualizado", psy });
  } catch (err) {
    console.error('Error updatePsychologist:', err);
    res.status(500).json({ message: 'Error al actualizar psicólogo' });
  }
};

// =========================
// ELIMINAR PSICÓLOGO
// =========================
const deletePsychologist = async (req, res) => {
  try {
    const { id } = req.params;

    const psy = await Psychologist.findByPk(id);
    if (!psy) return res.status(404).json({ message: "Psicólogo no encontrado" });

    await psy.destroy();

    res.json({ message: "Psicólogo eliminado" });
  } catch (err) {
    console.error('Error deletePsychologist:', err);
    res.status(500).json({ message: 'Error al eliminar psicólogo' });
  }
};

// ===================================================
// HORARIOS DISPONIBLES POR FECHA
// ===================================================
const getAvailableTimes = async (req, res) => {
  try {
    const psychologistId = req.params.id;
    const { date } = req.query;

    if (!date)
      return res.status(400).json({ message: "Debe enviar una fecha (YYYY-MM-DD)" });

    const psychologist = await Psychologist.findByPk(psychologistId);

    if (!psychologist)
      return res.status(404).json({ message: "Psicólogo no encontrado" });

    if (!psychologist.availability)
      return res.json({
        psychologistId,
        date,
        availableTimes: []
      });

    // Obtener el día de la semana (monday, tuesday...)
    const dayOfWeek = new Date(date)
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();

    const dayAvailability = psychologist.availability[dayOfWeek] || [];

    // Citas ya tomadas ese día
    const appointments = await Appointment.findAll({
      where: { psychologistId, date }
    });

    const takenTimes = appointments.map(a => a.time);

    // Horarios libres
    const availableTimes = dayAvailability.filter(time => !takenTimes.includes(time));

    res.json({
      psychologistId,
      date,
      availableTimes
    });

  } catch (err) {
    console.error("Error getAvailableTimes:", err);
    res.status(500).json({ message: "Error al obtener disponibilidad" });
  }
};

module.exports = {
  getAllPsychologists,
  getPsychologistById,
  createPsychologist,
  updatePsychologist,
  deletePsychologist,
  getAvailableTimes
};
