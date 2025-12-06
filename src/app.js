const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const psychologistRoutes = require('./routes/psychologistRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

const app = express();

// Middlewares globales
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true, // 🔥 NECESARIO PARA LOGIN
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
