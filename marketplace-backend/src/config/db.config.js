const debug = require("debug")("Proyecto-SED");
const { MongoClient } = require("mongodb");
const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("Error: MONGO_URI no está definido en el archivo .env");
  process.exit(1);
}

let client;
let db;

const connect = async () => {
  try {
    console.log("Intentando conectar a la base de datos...");
    client = new MongoClient(uri);
    await client.connect();
    db = client.db();
    debug("Connected successfully to database!");
    console.log("Conectado exitosamente a la base de datos");
  } catch (error) {
    debug("[Error]: Can't connect to database!", error);
    console.error("Error al conectar a la base de datos:", error.message);
    process.exit(1);
  }
};

const getDb = () => {
  if (!db) {
    throw new Error(
      "La base de datos no está inicializada. Llama a connect() primero."
    );
  }
  return db;
};

module.exports = { connect, getDb };
