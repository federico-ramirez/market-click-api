const { getDb } = require("../config/db.config");
const { ObjectId } = require("mongodb");

const validateProductoOrden = (productoOrden) => {
  if (
    !productoOrden.producto_id ||
    typeof productoOrden.producto_id !== "string"
  ) {
    throw new Error(
      "El campo 'producto_id' es requerido y debe ser un string."
    );
  }
  if (!productoOrden.titulo || typeof productoOrden.titulo !== "string") {
    throw new Error("El campo 'titulo' es requerido y debe ser un string.");
  }
  if (!productoOrden.precio || typeof productoOrden.precio !== "number") {
    throw new Error("El campo 'precio' es requerido y debe ser un número.");
  }
  if (productoOrden.color && typeof productoOrden.color !== "string") {
    throw new Error("El campo 'color' debe ser un string.");
  }
  if (productoOrden.talla && typeof productoOrden.talla !== "string") {
    throw new Error("El campo 'talla' debe ser un string.");
  }
  if (!productoOrden.cantidad || typeof productoOrden.cantidad !== "number") {
    throw new Error("El campo 'cantidad' es requerido y debe ser un número.");
  }
  if (!productoOrden.total || typeof productoOrden.total !== "number") {
    throw new Error("El campo 'total' es requerido y debe ser un número.");
  }
};

const validateOrden = (orden) => {
  if (!orden.userId || typeof orden.userId !== "string") {
    throw new Error("El campo 'userId' es requerido y debe ser un string.");
  }
  if (!orden.orden_id || typeof orden.orden_id !== "string") {
    throw new Error("El campo 'orden_id' es requerido y debe ser un string.");
  }
  if (!Array.isArray(orden.productos) || orden.productos.length === 0) {
    throw new Error("El campo 'productos' debe ser un arreglo no vacío.");
  }
  orden.productos.forEach(validateProductoOrden);
  if (!orden.total_orden || typeof orden.total_orden !== "number") {
    throw new Error(
      "El campo 'total_orden' es requerido y debe ser un número."
    );
  }
};

const Orden = {
  async create(orden) {
    validateOrden(orden);
    orden.userId = new ObjectId(orden.userId);
    orden.productos = orden.productos.map((producto) => ({
      ...producto,
      producto_id: new ObjectId(producto.producto_id),
    }));
    orden.fecha = new Date();
    const db = getDb();
    const result = await db.collection("ordenes").insertOne(orden);
    return result.insertedId;
  },

  async findById(id) {
    const db = getDb();
    const orden = await db
      .collection("ordenes")
      .findOne({ _id: new ObjectId(id) });
    return orden;
  },

  async findByUserId(userId) {
    const db = getDb();
    const ordenes = await db
      .collection("ordenes")
      .find({ userId: new ObjectId(userId) })
      .toArray();
    return ordenes;
  },

  async findAll() {
    const db = getDb();
    const ordenes = await db.collection("ordenes").find().toArray();
    return ordenes;
  },

  async updateById(id, updateData) {
    const db = getDb();
    if (updateData.userId) {
      updateData.userId = new ObjectId(updateData.userId);
    }
    if (updateData.productos) {
      updateData.productos = updateData.productos.map((producto) => ({
        ...producto,
        producto_id: new ObjectId(producto.producto_id),
      }));
    }
    const result = await db
      .collection("ordenes")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });
    return result.modifiedCount > 0;
  },

  async deleteById(id) {
    const db = getDb();
    const result = await db
      .collection("ordenes")
      .deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  },
};

module.exports = Orden;
