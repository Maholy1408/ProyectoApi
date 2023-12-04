const { request, response } = require("express");
const { pgPool } = require("../database/config");

// Función para manejar errores de manera uniforme
const handleError = (res, error, done) => {
  console.error(error);
  res.status(400).json({ error: error.message });
  if (done) done(); // Cierra la conexión
};

const obtenerSolicitudes = async (req, res = response) => {
  let done;
  try {
    const pgQuery = "SELECT * FROM solicitudes ORDER BY id_solicitud ASC";
    const solicitudes = await pgPool.query(pgQuery);
    res.status(200).json({
      solicitudes: solicitudes.rows,
      total: solicitudes.rowCount,
    });
  } catch (error) {
    handleError(res, error, done);
  } finally {
    if (done) done(); // Cierra la conexión
  }
};

const obtenerSolicitud = async (req = request, res = response) => {
  let done;
  try {
    const { id } = req.params;
    const pgQuery = "SELECT * FROM solicitudes WHERE id_solicitud = $1";
    const solicitud = await pgPool.query(pgQuery, [id]);

    if (solicitud.rowCount === 0) {
      return res.status(400).json({
        error: `La solicitud con el id: ${id} no fue encontrada`,
      });
    }

    res.status(200).json(solicitud.rows[0]);
  } catch (error) {
    handleError(res, error, done);
  } finally {
    if (done) done(); // Cierra la conexión
  }
};

const crearSolicitud = async (req = request, res = response) => {
  let done;
  try {
    const { id_usuario, nombre, correo, carrera, semestre } = req.body;
    const pgQuery =
      "INSERT INTO solicitudes (id_usuario, nombre_solicitud, correo_solicitud, carrera_solicitud, semestre_solicitud) VALUES ($1, $2, $3, $4, $5)";
    const nuevaSolicitud = await pgPool.query(pgQuery, [
      id_usuario,
      nombre,
      correo,
      carrera,
      semestre,
    ]);

    if (nuevaSolicitud.rowCount === 1) {
      const solicitudRegistrada = await pgPool.query(
        "SELECT * FROM solicitudes ORDER BY id_solicitud DESC LIMIT 1"
      );

      res.status(200).json({
        solicitud: solicitudRegistrada.rows[0],
        estado: true,
      });
    }
  } catch (error) {
    handleError(res, error, done);
  } finally {
    if (done) done(); // Cierra la conexión
  }
};

const actualizarSolicitud = async (req = request, res = response) => {
  let done;
  try {
    const { id } = req.params;
    const { nombre, correo, carrera, semestre } = req.body;
    const solicitud = await pgPool.query("SELECT * FROM solicitudes WHERE id_solicitud = $1", [id]);

    if (solicitud.rowCount === 0) {
      return res.status(400).json({
        error: `La solicitud con el id: ${id} no fue encontrada`,
      });
    }

    const solicitudActualizada = await pgPool.query(
      "UPDATE solicitudes SET nombre_solicitud = $1, correo_solicitud = $2, carrera_solicitud = $3, semestre_solicitud = $4 WHERE id_solicitud = $5",
      [nombre, correo, carrera, semestre, id]
    );

    if (solicitudActualizada.rowCount === 1) {
      solicitud.rows[0] = {
        ...solicitud.rows[0],
        nombre_solicitud: nombre,
        correo_solicitud: correo,
        carrera_solicitud: carrera,
        semestre_solicitud: semestre,
      };

      res.status(200).json({
        solicitud: solicitud.rows[0],
        estado: true,
      });
    }
  } catch (error) {
    handleError(res, error, done);
  } finally {
    if (done) done(); // Cierra la conexión
  }
};

const eliminarSolicitud = async (req = request, res = response) => {
  let done;
  try {
    const { id } = req.params;
    const solicitud = await pgPool.query("SELECT * FROM solicitudes WHERE id_solicitud = $1", [id]);

    if (solicitud.rowCount === 0) {
      return res.status(400).json({
        error: `La solicitud con el id: ${id} no fue encontrada`,
      });
    }

    const solicitudEliminada = await pgPool.query(
      "DELETE FROM solicitudes WHERE id_solicitud = $1",
      [id]
    );

    if (solicitudEliminada.rowCount === 1) {
      res.status(200).json({
        solicitud: solicitud.rows[0],
        estado: true,
      });
    }
  } catch (error) {
    handleError(res, error, done);
  } finally {
    if (done) done(); // Cierra la conexión
  }
};

module.exports = {
  obtenerSolicitudes,
  obtenerSolicitud,
  crearSolicitud,
  actualizarSolicitud,
  eliminarSolicitud,
};
