const { request, response } = require("express");
const { pgPool } = require("../database/config");

// Función para manejar errores de manera uniforme
const handleError = (res, error, done) => {
  console.error(error);
  res.status(400).json({ error: error.message });
  if (done) done(); // Cierra la conexión
};

const obtenerUsuarios = async (req, res = response) => {
  let done;
  try {
    const pgQuery = "SELECT * FROM usuarios ORDER BY id_usuario ASC";
    const usuarios = await pgPool.query(pgQuery);
    res.status(200).json({
      usuarios: usuarios.rows,
      total: usuarios.rowCount,
    });
  } catch (error) {
    handleError(res, error, done);
  } finally {
    if (done) done(); // Cierra la conexión
  }
};

const obtenerUsuario = async (req = request, res = response) => {
  let done;
  try {
    const { id } = req.params;
    const pgQuery = "SELECT * FROM usuarios WHERE id_usuario = $1";
    const usuario = await pgPool.query(pgQuery, [id]);

    if (usuario.rowCount === 0) {
      return res.status(400).json({
        error: `El usuario con el id: '${id}' no fue encontrado`,
      });
    }

    res.status(200).json(usuario.rows[0]);
  } catch (error) {
    handleError(res, error, done);
  } finally {
    if (done) done(); // Cierra la conexión
  }
};

const crearUsuario = async (req = request, res = response) => {
  let done;
  try {
    const { nombre, apellido, nick_usuario, correo, contrasena } = req.body;
    const usuario = await pgPool.query("SELECT * FROM usuarios WHERE nick_usuario = $1", [
      nick_usuario,
    ]);

    if (usuario.rowCount === 1) {
      return res.status(400).json({
        error: `El usuario con el nick: '${nick_usuario}' ya está registrado`,
      });
    }

    const nuevoUsuario = await pgPool.query(
      "INSERT INTO usuarios (nombre_usuario, apellido_usuario, nick_usuario, correo_usuario, pass_usuario) VALUES ($1, $2, $3, $4, $5)",
      [nombre, apellido, nick_usuario, correo, contrasena]
    );

    if (nuevoUsuario.rowCount === 1) {
      const usuarioRegistrado = await pgPool.query(
        "SELECT * FROM usuarios ORDER BY id_usuario DESC LIMIT 1"
      );

      res.status(200).json({
        usuario: usuarioRegistrado.rows[0],
        estado: true,
      });
    }
  } catch (error) {
    handleError(res, error, done);
  } finally {
    if (done) done(); // Cierra la conexión
  }
};

const actualizarUsuario = async (req = request, res = response) => {
  let done;
  try {
    const { id } = req.params;
    const { nombre, correo } = req.body;
    const usuario = await pgPool.query("SELECT * FROM usuarios WHERE id_usuario = $1", [id]);

    if (usuario.rowCount === 0) {
      return res.status(400).json({
        error: `El usuario con el id: '${id}' no fue encontrado`,
      });
    }

    const usuarioActualizado = await pgPool.query(
      "UPDATE usuarios SET nombre_usuario = $1, correo_usuario = $2 WHERE id_usuario = $3",
      [nombre, correo, id]
    );

    if (usuarioActualizado.rowCount === 1) {
      usuario.rows[0].nombre_usuario = nombre;
      usuario.rows[0].correo_usuario = correo;

      res.status(200).json({
        usuario: usuario.rows[0],
        estado: true,
      });
    }
  } catch (error) {
    handleError(res, error, done);
  } finally {
    if (done) done(); // Cierra la conexión
  }
};

const eliminarUsuario = async (req = request, res = response) => {
  let done;
  try {
    const { id } = req.params;
    const usuario = await pgPool.query("SELECT * FROM usuarios WHERE id_usuario = $1", [id]);

    if (usuario.rowCount === 0) {
      return res.status(400).json({
        error: `El usuario con el id: '${id}' no fue encontrado`,
      });
    }

    const usuarioEliminado = await pgPool.query("DELETE FROM usuarios WHERE id_usuario = $1", [id]);

    if (usuarioEliminado.rowCount === 1) {
      res.status(200).json({
        usuario: usuario.rows[0],
        estado: true,
      });
    }
  } catch (error) {
    handleError(res, error, done);
  } finally {
    if (done) done(); // Cierra la conexión
  }
};

const iniciarSesion = async (req = request, res = response) => {
  let done;
  try {
    const { nick_usuario, contrasena } = req.body;
    const usuario = await pgPool.query(
      "SELECT * FROM usuarios WHERE nick_usuario = $1 AND pass_usuario = $2",
      [nick_usuario, contrasena]
    );

    if (usuario.rowCount === 0) {
      return res.status(400).json({
        error: "El usuario no fue encontrado",
      });
    }

    res.status(200).json(usuario.rows[0]);
  } catch (error) {
    handleError(res, error, done);
  } finally {
    if (done) done(); // Cierra la conexión
  }
};

module.exports = {
  obtenerUsuarios,
  obtenerUsuario,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  iniciarSesion,
};
