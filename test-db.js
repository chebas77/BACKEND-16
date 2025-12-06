const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  try {
    console.log('Probando conexión con:');
    console.log({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      database: process.env.DB_NAME
    });

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
      // ssl: { rejectUnauthorized: false }  <-- déjalo apagado por ahora
    });

    console.log('✅ Conectado correctamente a MySQL');
    await connection.end();
  } catch (err) {
    console.error('❌ Error probando conexión:');
    console.error(err);
  }
})();
