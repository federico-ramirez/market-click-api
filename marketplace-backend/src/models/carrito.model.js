const { getDb } = require("../config/db.config");
const { ObjectId } = require("mongodb");

const validateCarrito = (carrito) => {
  if (!carrito.userId || typeof carrito.userId !== "string") {
    throw new Error("El campo 'userId' es requerido y debe ser un string.");
  }
  if (!carrito.producto_id || typeof carrito.producto_id !== "string") {
    throw new Error(
      "El campo 'producto_id' es requerido y debe ser un string."
    );
  }
  if (!carrito.titulo || typeof carrito.titulo !== "string") {
    throw new Error("El campo 'titulo' es requerido y debe ser un string.");
  }
  if (!carrito.precio || typeof carrito.precio !== "number") {
    throw new Error("El campo 'precio' es requerido y debe ser un número.");
  }
  if (carrito.color && typeof carrito.color !== "string") {
    throw new Error("El campo 'color' debe ser un string.");
  }
  if (carrito.talla && typeof carrito.talla !== "string") {
    throw new Error("El campo 'talla' debe ser un string.");
  }
  if (!carrito.cantidad || typeof carrito.cantidad !== "number") {
    throw new Error("El campo 'cantidad' es requerido y debe ser un número.");
  }
  if (!carrito.total || typeof carrito.total !== "number") {
    throw new Error("El campo 'total' es requerido y debe ser un número.");
  }
  if (!carrito.imagenUrl || typeof carrito.imagenUrl !== "string") {
    throw new Error("El campo 'imagenUrl' es requerido y debe ser un string.");
  }
};

const Carrito = {
  async create(carrito) {
    validateCarrito(carrito);
    carrito.userId = new ObjectId(carrito.userId);
    carrito.producto_id = new ObjectId(carrito.producto_id);
    const db = getDb();
    const result = await db.collection("carritos").insertOne(carrito);
    return result.insertedId;
  },

  async findById(id) {
    const db = getDb();
    const carrito = await db
      .collection("carritos")
      .findOne({ _id: new ObjectId(id) });
    return carrito;
  },

  async findByUserId(userId) {
    const db = getDb();
    const carritos = await db
      .collection("carritos")
      .find({ userId: new ObjectId(userId) })
      .toArray();
    return carritos;
  },

  async findAll() {
    const db = getDb();
    const carritos = await db.collection("carritos").find().toArray();
    return carritos;
  },

  async updateById(id, updateData) {
    const db = getDb();
    if (updateData.userId) {
      updateData.userId = new ObjectId(updateData.userId);
    }
    if (updateData.producto_id) {
      updateData.producto_id = new ObjectId(updateData.producto_id);
    }
    const result = await db
      .collection("carritos")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });
    return result.modifiedCount > 0;
  },

  async deleteById(id) {
    const db = getDb();
    const result = await db
      .collection("carritos")
      .deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  },

  async deleteByUserId(userId) {
    const db = getDb();
    const result = await db
      .collection("carritos")
      .deleteMany({ userId: new ObjectId(userId) });
    return result.deletedCount;
  },
};

module.exports = Carrito;
