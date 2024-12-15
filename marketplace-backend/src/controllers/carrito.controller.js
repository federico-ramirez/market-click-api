const Carrito = require("../models/carrito.model");
const Producto = require("../models/productos.model");

exports.addToCart = async (req, res, userId, productoId, data) => {
  try {
    const producto = await Producto.findById(productoId);
    if (!producto) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Producto no encontrado" }));
      return;
    }

    const cantidad = data.cantidad;
    if (!cantidad || cantidad <= 0) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "La cantidad debe ser mayor a 0" }));
      return;
    }

    const imagenUrl = producto.imagenes?.[0]?.url || "";

    const carritoItem = {
      userId,
      producto_id: producto._id.toString(),
      titulo: producto.titulo,
      precio: producto.precio,
      color: producto.color,
      talla: producto.talla,
      cantidad,
      total: producto.precio * cantidad,
      imagenUrl,
    };

    const carritoItemId = await Carrito.create(carritoItem);

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Producto añadido al carrito",
        carritoItemId,
      })
    );
  } catch (error) {
    console.error("Error en addToCart:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Error al añadir producto al carrito",
        error: error.message,
      })
    );
  }
};

exports.getCart = async (req, res, userId) => {
  try {
    const productosCarrito = await Carrito.findByUserId(userId);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(productosCarrito));
  } catch (error) {
    console.error("Error en getCart:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Error al obtener carrito",
        error: error.message,
      })
    );
  }
};

exports.clearCart = async (req, res, userId) => {
  try {
    const deletedCount = await Carrito.deleteByUserId(userId);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: `Carrito vaciado con éxito. ${deletedCount} elementos eliminados.`,
      })
    );
  } catch (error) {
    console.error("Error en clearCart:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Error al vaciar el carrito",
        error: error.message,
      })
    );
  }
};
