const usuarioController = require("../controllers/usuarios.controller");
const authController = require("../controllers/auth.controller");

exports.usuarioRoutes = async (req, res, urlParts, data, userId, rol) => {
  if (req.method === "POST" && urlParts.length === 1) {
    await usuarioController.createUsuario(req, res, data);
  } else if (
    req.method === "POST" &&
    urlParts.length === 2 &&
    urlParts[1] === "login"
  ) {
    await usuarioController.loginUsuario(req, res, data);
  } else if (
    req.method === "POST" &&
    urlParts.length === 2 &&
    urlParts[1] === "refresh"
  ) {
    await authController.refreshToken(req, res);
  } else if (req.method === "GET" && urlParts.length === 1) {
    await usuarioController.getUsuarios(req, res, userId, rol);
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Ruta no encontrada" }));
  }
};
