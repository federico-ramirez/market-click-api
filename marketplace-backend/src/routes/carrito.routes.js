const carritoController = require("../controllers/carrito.controller");

exports.carritoRoutes = async (req, res, urlParts, data, userId) => {
  if (req.method === "PUT" && urlParts.length === 2) {
    const productoId = urlParts[1];
    await carritoController.addToCart(req, res, userId, productoId, data);
  } else if (req.method === "GET" && urlParts.length === 1) {
    await carritoController.getCart(req, res, userId);
  } else if (req.method === "DELETE" && urlParts.length === 1) {
    await carritoController.clearCart(req, res, userId);
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Ruta no encontrada" }));
  }
};
