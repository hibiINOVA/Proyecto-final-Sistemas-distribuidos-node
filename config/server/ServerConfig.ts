import express, { Application } from "express";
import { SERVER_PORT } from "../../globals/Enviroment";
import authRoutes from "../../routes/AuthRoutes"; 
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";

export default class ServerConfig {
  private static _instance: ServerConfig;
  public app: Application;
  public port: number;
  public httpServer: http.Server;

  private constructor() {
    this.app = express();
    this.port = SERVER_PORT;
    this.httpServer = new http.Server(this.app);

    console.log("ServerConfig cargado");

    this.app.use(cors({
      origin: "http://localhost:4200",
      methods: "GET,POST,PUT,DELETE",
      allowedHeaders: "Content-Type, Authorization"
    }));

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));

    this.app.use("/auth", authRoutes);

    console.log("Rutas /auth registradas");
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  start() {
    this.httpServer.listen(this.port, () => {
      console.log(`Server iniciado en el puerto ${this.port}`);
    });
  }
}
