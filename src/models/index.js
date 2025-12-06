const sequelize = require('../config/database');
const Role = require('./Role');
const User = require('./User');
const Psychologist = require('./Psychologist');
const Appointment = require('./Appointment');

// Las asociaciones se definen dentro de cada modelo (User.js, Appointment.js, etc.)
// para evitar duplicación de asociaciones y errores de alias.

const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión establecida con la BD ✅');

    await Role.sync();
    await User.sync();
    await Psychologist.sync();
    await Appointment.sync();

    const roles = ['ADMIN', 'PSYCHOLOGIST', 'PATIENT'];

    for (const name of roles) {
      await Role.findOrCreate({ where: { name }, defaults: { name } });
    }

    console.log('Base de datos sincronizada correctamente');
  } catch (err) {
    console.error('Error al sincronizar la BD:', err);
  }
};

module.exports = {
  initDatabase,
  Role,
  User,
  Psychologist,
  Appointment
};