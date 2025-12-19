const mysql = require('mysql2/promise');

export default async function handler(req, res) {
  const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: true }
  };

  try {
    const db = await mysql.createConnection(dbConfig);

    if (req.method === 'POST') {
      const { cliente, barbero, fecha, hora } = req.body;
      await db.execute(
        'INSERT INTO citas (nombre_cliente, barbero, fecha, hora) VALUES (?, ?, ?, ?)',
        [cliente, barbero, fecha, hora]
      );
      await db.end();
      return res.status(200).json({ mensaje: '✅ Cita agendada en la base de datos' });
    }

    if (req.method === 'GET') {
      const [rows] = await db.execute('SELECT * FROM citas ORDER BY fecha, hora');
      await db.end();
      return res.status(200).json(rows);
    }
  } catch (error) {
    return res.status(500).json({ error: 'Error de conexión', detalle: error.message });
  }
}