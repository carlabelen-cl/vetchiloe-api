import express from 'express';
import cors from 'cors';
import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;
const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

app.get('/', (req, res) => {
  res.json({ ok: true, mensaje: 'API vetChiloé funcionando' });
});

app.get('/api/pacientes', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM pacientes ORDER BY id ASC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener pacientes' });
  }
});

app.get('/api/pacientes/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM pacientes WHERE id = $1',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al buscar paciente' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});