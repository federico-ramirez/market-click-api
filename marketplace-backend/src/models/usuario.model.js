const { getDb } = require("../config/db.config");
const { ObjectId } = require("mongodb");

const validateUsuario = (usuario) => {
  if (!usuario.nombre || typeof usuario.nombre !== "string") {
    throw new Error("El campo 'nombre' es requerido y debe ser un string.");
  }
  if (!usuario.email || typeof usuario.email !== "string") {
    throw new Error("El campo 'email' es requerido y debe ser un string.");
  }
  if (!usuario.contra || typeof usuario.contra !== "string") {
    throw new Error("El campo 'contra' es requerido y debe ser un string.");
  }
  if (
    usuario.rol &&
    (!usuario.rol.nombre || typeof usuario.rol.nombre !== "string")
  ) {
    throw new Error("El campo 'rol.nombre' debe ser un string.");
  }
};

const Usuario = {
  async create(usuario) {
    validateUsuario(usuario);
    const db = getDb();
    const result = await db.collection("usuarios").insertOne(usuario);
    return result.insertedId;
  },

  async findByEmail(email) {
    const db = getDb();
    const usuario = await db.collection("usuarios").findOne({ email });
    return usuario;
  },

  async findById(id) {
    const db = getDb();
    const usuario = await db
      .collection("usuarios")
      .findOne({ _id: new ObjectId(id) });
    return usuario;
  },

  async findByRefreshToken(refreshToken) {
    const db = getDb();
    const usuario = await db.collection("usuarios").findOne({ refreshToken });
    return usuario;
  },

  async findAll() {
    const db = getDb();
    const usuarios = await db.collection("usuarios").find().toArray();
    return usuarios;
  },

  async findByRole(rol) {
    const db = getDb();
    const usuarios = await db
      .collection("usuarios")
      .find({ "rol.nombre": rol })
      .toArray();
    return usuarios;
  },

  async updateById(id, updateData) {
    const db = getDb();
    const result = await db
      .collection("usuarios")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });
    return result.modifiedCount > 0;
  },

  async deleteById(id) {
    const db = getDb();
    const result = await db
      .collection("usuarios")
      .deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  },
};

module.exports = Usuario;
