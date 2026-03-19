require('dotenv').config();
const express = require('express');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// GET /api/doctores
app.get('/api/doctores', async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM doctores`);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener doctores: " + error.message });
  }
});

// GET /api/citas
app.get('/api/citas', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        c.id,
        c.paciente,
        c.fecha,
        c.motivo,
        d.nombre AS doctor
      FROM citas c
      INNER JOIN doctores d ON c.doctor_id = d.id
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener citas: " + error.message });
  }
});

// POST /api/doctores
app.post('/api/doctores', async (req, res) => {
  try {
    const { nombre, especialidad } = req.body;

    if (!nombre || !especialidad) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }

    const [result] = await db.query(`
      INSERT INTO doctores (nombre, especialidad)
      VALUES (?, ?)
    `, [nombre, especialidad]);

    res.status(201).json({ message: "Doctor creado correctamente", id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// POST /api/citas
app.post('/api/citas', async (req, res) => {
  try {
    const { paciente, fecha, motivo, doctor_id } = req.body;

    if (!paciente || !fecha || !motivo || !doctor_id) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }

    const [result] = await db.query(`
      INSERT INTO citas (paciente, fecha, motivo, doctor_id)
      VALUES (?, ?, ?, ?)
    `, [paciente, fecha, motivo, doctor_id]);

    res.status(201).json({ message: "Cita creada correctamente", id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/citas/:id  → actualiza todos los campos
app.put('/api/citas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { paciente, fecha, motivo, doctor_id } = req.body;

    if (!paciente || !fecha || !motivo || !doctor_id) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }

    await db.query(`
      UPDATE citas
      SET paciente = ?, fecha = ?, motivo = ?, doctor_id = ?
      WHERE id = ?
    `, [paciente, fecha, motivo, doctor_id, id]);

    res.json({ message: "Cita actualizada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// PATCH /api/citas/:id  → actualiza solo los campos que se manden
app.patch('/api/citas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const campos = req.body;

    if (Object.keys(campos).length === 0) {
      return res.status(400).json({ message: "No se enviaron campos para actualizar" });
    }

    const permitidos = ['paciente', 'fecha', 'motivo', 'doctor_id'];
    const updates = [];
    const valores = [];

    for (const campo of permitidos) {
      if (campos[campo] !== undefined) {
        updates.push(`${campo} = ?`);
        valores.push(campos[campo]);
      }
    }

    valores.push(id);

    await db.query(
      `UPDATE citas SET ${updates.join(', ')} WHERE id = ?`,
      valores
    );

    res.json({ message: "Cita actualizada parcialmente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/citas/:id
app.delete('/api/citas/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(`DELETE FROM citas WHERE id = ?`, [id]);

    res.json({ message: "Cita eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});