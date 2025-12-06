const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");
const Psychologist = require("./Psychologist");

const Appointment = sequelize.define("Appointment", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  time: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM("PENDING", "CONFIRMED", "CANCELLED"),
    defaultValue: "PENDING"
  }
}, {
  tableName: "appointments",
  timestamps: true
});

// RELACIONES
User.hasMany(Appointment, { foreignKey: "patientId" });
Appointment.belongsTo(User, { as: "patient", foreignKey: "patientId" });

Psychologist.hasMany(Appointment, { foreignKey: "psychologistId" });
Appointment.belongsTo(Psychologist, { foreignKey: "psychologistId" });

module.exports = Appointment;
