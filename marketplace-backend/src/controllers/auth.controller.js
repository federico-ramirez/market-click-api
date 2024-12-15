const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario.model");

exports.refreshToken = async (req, res) => {
  const refreshToken = req.headers["authorization"]?.split(" ")[1];

  if (!refreshToken) {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Refresh token requerido" }));
    return;
  }

  try {
    const usuario = await Usuario.findByRefreshToken(refreshToken);

    if (!usuario) {
      res.writeHead(403, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Refresh token inválido" }));
      return;
    }

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
      (error, decoded) => {
        if (error) {
          res.writeHead(403, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ message: "Token de actualización inválido" })
          );
          return;
        }

        const newAccessToken = jwt.sign(
          { userId: usuario._id, rol: usuario.rol },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ accessToken: newAccessToken }));
      }
    );
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Error al procesar el refresh token",
        error: error.message,
      })
    );
  }
};
