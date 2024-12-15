const ordenController = require("../controllers/orden.controller");

exports.ordenRoutes = async (req, res, urlParts, userId) => {
  if (req.method === "POST" && urlParts.length === 1) {
    await ordenController.checkoutCart(req, res, userId);
  } else if (req.method === "GET" && urlParts.length === 1) {
    await ordenController.getOrders(req, res, userId);
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Ruta no encontrada" }));
  }
};
