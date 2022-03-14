const express = require("express");
const cors = require("cors");
const { dbConection } = require("../database/config");
const fileUpload = require("express-fileupload");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      users: "/api/users",
      auth: "/api/auth",
      categories: "/api/categories",
      products: "/api/products",
      search: "/api/search",
      uploads: "/api/uploads",
    };

    // connectDB
    this.connectDatabase();

    // middlewares
    this.middlewares();

    // app routes
    this.routes();
  }

  async connectDatabase() {
    await dbConection();
  }

  routes() {
    this.app.use(this.paths.auth, require("../routes/auth"));
    this.app.use(this.paths.users, require("../routes/users"));
    this.app.use(this.paths.categories, require("../routes/categories"));
    this.app.use(this.paths.products, require("../routes/products"));
    this.app.use(this.paths.search, require("../routes/search"));
    this.app.use(this.paths.uploads, require("../routes/uploads"));
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // read and parse body
    // cualquier info que venga en post, put o delete, la serializa a formato json
    this.app.use(express.json());

    // public directory
    this.app.use(express.static("public"));

    // FileUpload - Carga de archivos
    // esto es necesario segun la doc de este paquete
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  listen() {
    this.app.listen(this.port, () =>
      console.log(`Server running in port ${this.port}`)
    );
  }
}

module.exports = Server;
