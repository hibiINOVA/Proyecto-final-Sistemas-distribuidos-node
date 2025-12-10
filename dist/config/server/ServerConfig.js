"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Enviroment_1 = require("../../globals/Enviroment");
const AuthRoutes_1 = __importDefault(require("../../routes/AuthRoutes"));
const http_1 = __importDefault(require("http"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
class ServerConfig {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = Enviroment_1.SERVER_PORT;
        this.httpServer = new http_1.default.Server(this.app);
        console.log("ServerConfig cargado");
        this.app.use((0, cors_1.default)({
            origin: "http://localhost:4200",
            methods: "GET,POST,PUT,DELETE",
            allowedHeaders: "Content-Type, Authorization"
        }));
        this.app.use(body_parser_1.default.json());
        this.app.use(body_parser_1.default.urlencoded({ extended: true }));
        this.app.use("/auth", AuthRoutes_1.default);
        console.log("Rutas /auth registradas");
    }
    static get instance() {
        return this._instance || (this._instance = new this());
    }
    start() {
        this.httpServer.listen(this.port, () => {
            console.log(`Server iniciado en el puerto ${this.port}`);
        });
    }
}
exports.default = ServerConfig;
