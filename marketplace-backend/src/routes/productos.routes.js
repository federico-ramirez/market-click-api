const productoController = require("../controllers/producto.controller");

exports.productoRoutes = async (req, res, urlParts, data, userId) => {
  if (req.method === "GET" && urlParts.length === 1) {
    await productoController.getAllProductos(req, res);
  } else if (
    req.method === "GET" &&
    urlParts.length === 3 &&
    urlParts[1] === "usuario"
  ) {
    const usuarioId = urlParts[2];
    await productoController.getProductosByUsuario(req, res, usuarioId);
  } else if (req.method === "POST" && urlParts.length === 1) {
    await productoController.createProducto(req, res, userId, data);
  } else if (req.method === "PUT" && urlParts.length === 2) {
    const productoId = urlParts[1];
    await productoController.updateProducto(req, res, userId, productoId, data);
  } else if (req.method === "DELETE" && urlParts.length === 2) {
    const productoId = urlParts[1];
    await productoController.deleteProducto(req, res, userId, productoId);
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Ruta no encontrada" }));
  }
};
