const express = require("express");
const cors = require("cors");
const { dbConection } = require("../database/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usersPath = "/api/users";

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
    this.app.use(this.usersPath, require("../routes/users"));
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // read and parse body
    // cualquier info que venga en post, put o delete, la serializa a formato json
    this.app.use(express.json());

    // public directory
    this.app.use(express.static("public"));
  }

  listen() {
    this.app.listen(this.port, () =>
      console.log(`Server running in port ${this.port}`)
    );
  }
}

module.exports = Server;
