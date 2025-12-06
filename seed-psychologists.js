require('dotenv').config();
const { Psychologist } = require('./src/models');
const sequelize = require('./src/config/database');

// Datos de prueba: psicólogos con availability en inglés
const psychologistsData = [
  {
    fullName: 'Dra. Ana Morales',
    specialty: 'Psicología Clínica',
    description: 'Especialista en ansiedad y depresión',
    email: 'ana@psico.com',
    phone: '987654322',
    availability: {
      monday: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
      tuesday: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
      wednesday: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
      thursday: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
      friday: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
      saturday: [],
      sunday: []
    }
  },
  {
    fullName: 'Dr. Carlos López',
    specialty: 'Psicología del Deporte',
    description: 'Mejora del rendimiento mental en atletas',
    email: 'carlos@psico.com',
    phone: '987654323',
    availability: {
      monday: ['10:00', '11:00', '12:00', '15:00', '16:00'],
      tuesday: ['10:00', '11:00', '12:00', '15:00', '16:00'],
      wednesday: [],
      thursday: ['10:00', '11:00', '12:00', '15:00', '16:00'],
      friday: ['10:00', '11:00', '12:00', '15:00', '16:00'],
      saturday: ['09:00', '10:00', '11:00'],
      sunday: []
    }
  },
  {
    fullName: 'Dra. María García',
    specialty: 'Terapia Familiar',
    description: 'Conflictos familiares y relaciones interpersonales',
    email: 'maria@psico.com',
    phone: '987654324',
    availability: {
      monday: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'],
      tuesday: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'],
      wednesday: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'],
      thursday: [],
      friday: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'],
      saturday: [],
      sunday: []
    }
  }
];

(async () => {
  try {
    // Conectar y sincronizar
    await sequelize.authenticate();
    console.log('Conectado a la BD ✅');

    // Limpiar psicólogos anteriores (opcional)
    // await Psychologist.destroy({ where: {} });
    // console.log('Psicólogos anteriores eliminados');

    // Crear nuevos psicólogos
    for (const data of psychologistsData) {
      const [psy, created] = await Psychologist.findOrCreate({
        where: { email: data.email },
        defaults: data
      });

      if (created) {
        console.log(`✅ Psicólogo creado: ${psy.fullName}`);
      } else {
        console.log(`ℹ️  Psicólogo ya existe: ${psy.fullName}`);
      }
    }

    console.log('\n✅ Seed completado');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error en seed:', err);
    process.exit(1);
  }
})();