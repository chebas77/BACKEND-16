const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const psychologistRoutes = require('./routes/psychologistRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

const app = express();

// Configurar orígenes permitidos
const allowedOrigins = [
  'http://localhost:3000',
  'https://frontend-16.vercel.app',
  'https://frontend-16-two.vercel.app',
  'https://frontend-16-git-main-msrj743-1903s-projects.vercel.app'
];

// Middlewares globales
app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir requests sin origin (como apps móviles o curl)
      if (!origin) return callback(null, true);
      
      // Permitir si el origin está en la lista O si es un subdominio de vercel
      if (allowedOrigins.includes(origin) || origin.includes('vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Ruta básica de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API Psicología funcionando correctamente 🚀' });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/psychologists', psychologistRoutes);
app.use('/api/appointments', appointmentRoutes);

module.exports = app;
