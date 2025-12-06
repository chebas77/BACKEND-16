const sequelize = require('../config/database');
const Role = require('./Role');
const User = require('./User');
const Psychologist = require('./Psychologist');
const Appointment = require('./Appointment');

// RELACIONES (IMPORTANTE)
Role.hasMany(User, { foreignKey: 'roleId' });
User.belongsTo(Role, { foreignKey: 'roleId' });

Psychologist.hasMany(Appointment, { foreignKey: 'psychologistId' });
Appointment.belongsTo(Psychologist, { foreignKey: 'psychologistId' });

User.hasMany(Appointment, { foreignKey: 'userId' });
Appointment.belongsTo(User, { foreignKey: 'userId' });

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
