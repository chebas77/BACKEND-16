require('dotenv').config();
const app = require('./app');
const { initDatabase } = require('./models');

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await initDatabase(); // Conecta y sincroniza la BD
    console.log("Base de datos inicializada correctamente 🚀");

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
  }
};

startServer();
