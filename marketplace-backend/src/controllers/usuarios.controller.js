const Usuario = require("../models/usuario.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.getUsuarios = async (req, res, userId, rol) => {
  if (rol !== "administrador") {
    res.writeHead(403);
    res.end(
      JSON.stringify({ message: "Acceso denegado: solo administradores" })
    );
    return;
  }

  try {
    const usuarios = await Usuario.findAll();
    res.writeHead(200);
    res.end(JSON.stringify(usuarios));
  } catch (error) {
    res.writeHead(500);
    res.end(
      JSON.stringify({
        message: "Error al obtener usuarios",
        error: error.message,
      })
    );
  }
};

exports.createUsuario = async (req, res, data) => {
  try {
    const hashedPassword = await bcrypt.hash(data.contra, 10);
    const nuevoUsuario = {
      ...data,
      contra: hashedPassword,
    };
    const usuarioId = await Usuario.create(nuevoUsuario);
    res.writeHead(201);
    res.end(
      JSON.stringify({
        message: "Usuario creado",
        usuarioId,
      })
    );
  } catch (error) {
    res.writeHead(400);
    res.end(
      JSON.stringify({
        message: "Error al crear usuario",
        error: error.message,
      })
    );
  }
};

exports.loginUsuario = async (req, res, data) => {
  try {
    const usuario = await Usuario.findByEmail(data.email);
    if (!usuario) {
      res.writeHead(404);
      res.end(JSON.stringify({ message: "Usuario no encontrado" }));
      return;
    }

    const isMatch = await bcrypt.compare(data.contra, usuario.contra);
    if (!isMatch) {
      res.writeHead(401);
      res.end(JSON.stringify({ message: "Contraseña incorrecta" }));
      return;
    }

    const userId = usuario._id.toString();

    const accessToken = jwt.sign(
      { userId, rol: usuario.rol.nombre },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });

    await Usuario.updateById(usuario._id, { refreshToken });

    res.writeHead(200);
    res.end(
      JSON.stringify({
        message: "Inicio de sesión exitoso",
        accessToken,
        refreshToken,
      })
    );
  } catch (error) {
    res.writeHead(500);
    res.end(
      JSON.stringify({
        message: "Error al iniciar sesión",
        error: error.message,
      })
    );
  }
};

exports.refreshToken = async (req, res) => {
  const refreshToken = req.headers["authorization"]?.split(" ")[1];

  if (!refreshToken) {
    res.writeHead(401);
    res.end(JSON.stringify({ message: "Refresh token requerido" }));
    return;
  }

  try {
    const usuarios = await Usuario.findAll();
    const usuario = usuarios.find((u) => u.refreshToken === refreshToken);

    if (!usuario) {
      res.writeHead(403);
      res.end(JSON.stringify({ message: "Refresh token inválido" }));
      return;
    }

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
      (error, decoded) => {
        if (error) {
          res.writeHead(403);
          res.end(
            JSON.stringify({ message: "Token de actualización inválido" })
          );
          return;
        }

        const newAccessToken = jwt.sign(
          { userId: usuario._id, rol: usuario.rol.nombre },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        res.writeHead(200);
        res.end(JSON.stringify({ accessToken: newAccessToken }));
      }
    );
  } catch (error) {
    res.writeHead(500);
    res.end(
      JSON.stringify({
        message: "Error al procesar el refresh token",
        error: error.message,
      })
    );
  }
};
