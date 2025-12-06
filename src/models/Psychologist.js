const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Psychologist = sequelize.define('Psychologist', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fullName: {
    type: DataTypes.STRING(120),
    allowNull: false
  },
  specialty: {
    type: DataTypes.STRING(120),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(120),
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },

  // 🔥 AGENDA CORREGIDA → Ahora usa ARRAYS de horas, no booleanos
  availability: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: []
    }
  }

}, {
  tableName: 'psychologists',
  timestamps: true
});

module.exports = Psychologist;
