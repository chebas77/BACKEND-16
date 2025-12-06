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

    // Obtener el día de la semana (monday, tuesday...)
    const dayOfWeek = new Date(date)
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();

    const availabilityObj = psychologist.availability || {};
    const dayAvailability = availabilityObj[dayOfWeek] || [];

    // DEBUG: imprimir estado para diagnóstico
    console.log(`DEBUG getAvailableTimes | psyId=${psychologistId} date=${date} day=${dayOfWeek}`);
    console.log(`DEBUG availability object:`, availabilityObj);
    console.log(`DEBUG dayAvailability:`, dayAvailability);

    // Citas ya tomadas ese día
    const appointments = await Appointment.findAll({
      where: { psychologistId, date }
    });

    const takenTimes = appointments.map(a => a.time);
    console.log(`DEBUG takenTimes:`, takenTimes);

    // Si no hay availability configurada, generamos slots por defecto (09:00-16:00)
    let workingTimes = dayAvailability.slice();
    if (!workingTimes || workingTimes.length === 0) {
      // Generar slots cada hora empezando a las 09:00 hasta las 16:00
      const startHour = 9;
      const endHour = 17; // no incluido
      const slots = [];
      for (let h = startHour; h < endHour; h++) {
        const hh = h.toString().padStart(2, '0');
        slots.push(`${hh}:00`);
      }
      workingTimes = slots;
      console.log(`DEBUG No availability set, using generated slots:`, workingTimes);
    }    // Horarios libres (filtramos los que ya están tomados)
    const availableTimes = workingTimes.filter(time => !takenTimes.includes(time));

    console.log(`DEBUG workingTimes:`, workingTimes);
    console.log(`DEBUG availableTimes:`, availableTimes);

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