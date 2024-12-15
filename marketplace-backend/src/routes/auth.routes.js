const authController = require("../controllers/auth.controller");

exports.authRoutes = async (req, res, urlParts, data) => {
  if (
    req.method === "POST" &&
    urlParts.length === 2 &&
    urlParts[1] === "refresh"
  ) {
    await authController.refreshToken(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Ruta no encontrada" }));
  }
};
