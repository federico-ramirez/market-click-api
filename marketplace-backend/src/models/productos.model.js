const { getDb } = require("../config/db.config");
const { ObjectId } = require("mongodb");

const validateProducto = (producto) => {
  if (!producto.titulo || typeof producto.titulo !== "string") {
    throw new Error("El campo 'titulo' es requerido y debe ser un string.");
  }
  if (producto.descripcion && typeof producto.descripcion !== "string") {
    throw new Error("El campo 'descripcion' debe ser un string.");
  }
  if (!producto.precio || typeof producto.precio !== "number") {
    throw new Error("El campo 'precio' es requerido y debe ser un número.");
  }
  if (producto.color && typeof producto.color !== "string") {
    throw new Error("El campo 'color' debe ser un string.");
  }
  if (producto.talla && typeof producto.talla !== "string") {
    throw new Error("El campo 'talla' debe ser un string.");
  }
  if (producto.marca && typeof producto.marca !== "string") {
    throw new Error("El campo 'marca' debe ser un string.");
  }
  if (!producto.userId || typeof producto.userId !== "string") {
    throw new Error("El campo 'userId' es requerido y debe ser un string.");
  }
  if (
    producto.imagenes &&
    !Array.isArray(producto.imagenes) &&
    producto.imagenes.some((img) => !img.url || typeof img.url !== "string")
  ) {
    throw new Error("Cada imagen debe tener un campo 'url' válido.");
  }
};

const Producto = {
  async create(producto) {
    validateProducto(producto);
    const db = getDb();
    const result = await db.collection("productos").insertOne(producto);
    return result.insertedId;
  },

  async findById(id) {
    const db = getDb();
    const producto = await db
      .collection("productos")
      .findOne({ _id: new ObjectId(id) });
    return producto;
  },

  async findAll() {
    const db = getDb();
    const productos = await db.collection("productos").find().toArray();
    return productos;
  },

  async findByUserId(userId) {
    const db = getDb();
    const productos = await db
      .collection("productos")
      .find({ userId })
      .toArray();
    return productos;
  },

  async updateById(id, updateData) {
    const db = getDb();

    if (!ObjectId.isValid(id)) {
      throw new Error("El id proporcionado no es válido.");
    }

    const validFields = [
      "titulo",
      "descripcion",
      "precio",
      "color",
      "talla",
      "marca",
      "imagenes",
    ];
    const filteredUpdateData = {};

    for (const key of validFields) {
      if (key in updateData) {
        filteredUpdateData[key] = updateData[key];
      }
    }

    if (updateData.userId) {
      filteredUpdateData.userId = new ObjectId(updateData.userId);
    }

    const result = await db
      .collection("productos")
      .updateOne({ _id: new ObjectId(id) }, { $set: filteredUpdateData });

    return result.modifiedCount > 0;
  },
  async deleteById(id) {
    const db = getDb();
    const result = await db
      .collection("productos")
      .deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  },
};

module.exports = Producto;
