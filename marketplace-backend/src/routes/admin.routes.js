const adminController = require("../controllers/admin.controller");

exports.adminRoutes = async (req, res, urlParts, data, userId, rol) => {
  const targetUserId = urlParts[1];

  if (req.method === "GET" && urlParts.length === 1) {
    await adminController.getAllUsers(req, res, rol);
  } else if (req.method === "GET" && urlParts.length === 2) {
    await adminController.getUserById(req, res, rol, targetUserId);
  } else if (req.method === "PUT" && urlParts.length === 2) {
    await adminController.updateUser(req, res, rol, targetUserId, data);
  } else if (req.method === "DELETE" && urlParts.length === 2) {
    await adminController.deleteUser(req, res, rol, targetUserId);
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Ruta no encontrada" }));
  }
};
