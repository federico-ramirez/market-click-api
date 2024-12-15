const Usuario = require("../models/usuario.model");
const { isAdmin } = require("../utils/auth.utils");

exports.getAllUsers = async (req, res, rol) => {
  if (!isAdmin(rol)) {
    res.writeHead(403);
    res.end(
      JSON.stringify({ message: "Acceso denegado: solo administradores" })
    );
    return;
  }

  try {
    const usuarios = await Usuario.findAll();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(usuarios));
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Error al obtener usuarios",
        error: error.message,
      })
    );
  }
};

exports.getUserById = async (req, res, rol, userId) => {
  if (!isAdmin(rol)) {
    res.writeHead(403);
    res.end(
      JSON.stringify({ message: "Acceso denegado: solo administradores" })
    );
    return;
  }

  try {
    const usuario = await Usuario.findById(userId);
    if (!usuario) {
      res.writeHead(404);
      res.end(JSON.stringify({ message: "Usuario no encontrado" }));
      return;
    }

    if (usuario.rol?.nombre === "superAdmin") {
      res.writeHead(403);
      res.end(
        JSON.stringify({
          message:
            "Acción denegada: no se puede acceder a usuarios con rol 'superAdmin'",
        })
      );
      return;
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(usuario));
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Error al obtener el usuario",
        error: error.message,
      })
    );
  }
};

exports.updateUser = async (req, res, rol, userId, data) => {
  if (!isAdmin(rol)) {
    res.writeHead(403);
    res.end(
      JSON.stringify({ message: "Acceso denegado: solo administradores" })
    );
    return;
  }

  try {
    const usuario = await Usuario.findById(userId);
    if (!usuario) {
      res.writeHead(404);
      res.end(JSON.stringify({ message: "Usuario no encontrado" }));
      return;
    }

    if (usuario.rol?.nombre === "superAdmin") {
      res.writeHead(403);
      res.end(
        JSON.stringify({
          message:
            "Acción denegada: no se puede modificar usuarios con rol 'superAdmin'",
        })
      );
      return;
    }

    const usuarioActualizado = await Usuario.updateById(userId, data);
    if (!usuarioActualizado) {
      res.writeHead(404);
      res.end(JSON.stringify({ message: "Usuario no encontrado" }));
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Usuario actualizado",
        })
      );
    }
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Error al actualizar el usuario",
        error: error.message,
      })
    );
  }
};

exports.deleteUser = async (req, res, rol, userId) => {
  if (!isAdmin(rol)) {
    res.writeHead(403);
    res.end(
      JSON.stringify({ message: "Acceso denegado: solo administradores" })
    );
    return;
  }

  try {
    const usuario = await Usuario.findById(userId);
    if (!usuario) {
      res.writeHead(404);
      res.end(JSON.stringify({ message: "Usuario no encontrado" }));
      return;
    }

    if (usuario.rol?.nombre === "superAdmin") {
      res.writeHead(403);
      res.end(
        JSON.stringify({
          message:
            "Acción denegada: no se puede eliminar usuarios con rol 'superAdmin'",
        })
      );
      return;
    }

    const usuarioEliminado = await Usuario.deleteById(userId);
    if (!usuarioEliminado) {
      res.writeHead(404);
      res.end(JSON.stringify({ message: "Usuario no encontrado" }));
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Usuario eliminado",
        })
      );
    }
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Error al eliminar el usuario",
        error: error.message,
      })
    );
  }
};
