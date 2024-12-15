require("dotenv").config();

const http = require("http");
const database = require("./src/config/db.config");
const { parseRequestBody } = require("./src/utils/parse.utils");
const { productoRoutes } = require("./src/routes/productos.routes");
const { usuarioRoutes } = require("./src/routes/usuarios.routes");
const { carritoRoutes } = require("./src/routes/carrito.routes");
const { ordenRoutes } = require("./src/routes/orden.routes");
const { adminRoutes } = require("./src/routes/admin.routes");
const { superAdminRoutes } = require("./src/routes/superAdmin.routes");
const { authRoutes } = require("./src/routes/auth.routes");
const { verifyToken } = require("./src/utils/auth.utils");

database.connect();

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const urlParts = req.url.split("/").filter((part) => part);

  if (urlParts[0] !== "api") {
    res.writeHead(404);
    res.end(JSON.stringify({ message: "Ruta no encontrada" }));
    return;
  }

  const trimmedParts = urlParts.slice(1);
  const publicRoutes = [
    "GET productos",
    "POST usuarios",
    "POST usuarios/login",
    "POST usuarios/refresh",
    "GET productos/usuario",
  ];

  const routePath = `${req.method} ${trimmedParts.join("/")}`;
  const isPublicRoute = publicRoutes.some((route) =>
    routePath.startsWith(route)
  );

  let userId, rol;

  if (!isPublicRoute) {
    const authResult = verifyToken(req);
    if (authResult.error) {
      res.writeHead(401);
      res.end(JSON.stringify({ message: authResult.error }));
      return;
    }
    ({ userId, rol } = authResult);
  }

  // Excepción para rutas específicas que no requieren parseRequestBody
  if (
    req.method === "POST" &&
    (routePath === "POST ordenes" || routePath === "POST usuarios/refresh")
  ) {
    routeHandler(req, res, trimmedParts, null, userId, rol);
    return;
  }

  if (["POST", "PUT"].includes(req.method)) {
    parseRequestBody(req, (data, error) => {
      if (error) {
        res.writeHead(400);
        res.end(
          JSON.stringify({ message: "Datos inválidos", error: error.message })
        );
        return;
      }
      routeHandler(req, res, trimmedParts, data, userId, rol);
    });
  } else {
    routeHandler(req, res, trimmedParts, null, userId, rol);
  }
});

function routeHandler(req, res, urlParts, data, userId, rol) {
  if (urlParts[0] === "usuarios") {
    usuarioRoutes(req, res, urlParts, data, userId, rol);
  } else if (urlParts[0] === "productos") {
    productoRoutes(req, res, urlParts, data, userId);
  } else if (urlParts[0] === "carrito") {
    carritoRoutes(req, res, urlParts, data, userId);
  } else if (urlParts[0] === "ordenes") {
    ordenRoutes(req, res, urlParts, userId);
  } else if (urlParts[0] === "admin") {
    adminRoutes(req, res, urlParts, data, userId, rol);
  } else if (urlParts[0] === "superAdmin") {
    superAdminRoutes(req, res, urlParts, data, userId, rol);
  } else if (urlParts[0] === "auth") {
    authRoutes(req, res, urlParts, data);
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ message: "Ruta no encontrada" }));
  }
}

server.listen(3000, () => {
  console.log("Servidor escuchando en el puerto 3000");
});
