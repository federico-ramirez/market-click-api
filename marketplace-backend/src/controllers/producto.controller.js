const Producto = require("../models/productos.model");

exports.getAllProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(productos));
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Error al obtener productos",
        error: error.message,
      })
    );
  }
};

exports.getProductosByUsuario = async (req, res, userId) => {
  try {
    const productos = await Producto.findByUserId(userId);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(productos));
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Error al obtener productos del usuario",
        error: error.message,
      })
    );
  }
};

exports.createProducto = async (req, res, userId, data) => {
  try {
    if (!userId) {
      throw new Error("No se proporcionó un userId válido");
    }

    const nuevoProducto = {
      ...data,
      userId,
    };
    const productoId = await Producto.create(nuevoProducto);
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Producto creado", productoId }));
  } catch (error) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Error al crear producto",
        error: error.message,
      })
    );
  }
};

exports.updateProducto = async (req, res, userId, productoId, data) => {
  try {
    const productoExistente = await Producto.findById(productoId);
    if (!productoExistente) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Producto no encontrado" }));
      return;
    }

    if (productoExistente.userId.toString() !== userId) {
      res.writeHead(403, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "No autorizado para actualizar este producto",
        })
      );
      return;
    }

    const productoActualizado = await Producto.updateById(productoId, data);
    if (productoActualizado) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Producto actualizado" }));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Error al actualizar producto" }));
    }
  } catch (error) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Error al actualizar producto",
        error: error.message,
      })
    );
  }
};

exports.deleteProducto = async (req, res, userId, productoId) => {
  try {
    const productoEliminado = await Producto.deleteById(productoId);
    if (productoEliminado) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Producto eliminado" }));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Producto no encontrado o no autorizado",
        })
      );
    }
  } catch (error) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Error al eliminar producto",
        error: error.message,
      })
    );
  }
};
