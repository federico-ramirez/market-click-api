const Carrito = require("../models/carrito.model");
const Orden = require("../models/orden.model");

exports.checkoutCart = async (req, res, userId) => {
  try {
    const productosCarrito = await Carrito.findByUserId(userId);

    if (productosCarrito.length === 0) {
      res.writeHead(400);
      res.end(JSON.stringify({ message: "El carrito está vacío" }));
      return;
    }

    const totalOrden = productosCarrito.reduce(
      (total, item) => total + item.total,
      0
    );

    const productosParaOrden = productosCarrito.map((item) => ({
      producto_id: item.producto_id.toString(),
      titulo: item.titulo,
      precio: item.precio,
      color: item.color,
      talla: item.talla,
      cantidad: item.cantidad,
      total: item.total,
    }));

    const nuevaOrden = {
      userId,
      orden_id: `ORD-${Date.now()}`,
      productos: productosParaOrden,
      total_orden: totalOrden,
      fecha: new Date(),
    };

    const ordenId = await Orden.create(nuevaOrden);
    await Carrito.deleteByUserId(userId);

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Compra realizada con éxito",
        ordenId,
      })
    );
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Error al procesar la compra",
        error: error.message,
      })
    );
  }
};

exports.getOrders = async (req, res, userId) => {
  try {
    const ordenes = await Orden.findByUserId(userId);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(ordenes));
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Error al obtener órdenes",
        error: error.message,
      })
    );
  }
};
