"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Enviroment_1 = require("../../globals/Enviroment");
const http_1 = __importDefault(require("http"));
class ServerConfig {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = Enviroment_1.SERVER_PORT;
        this.httpServer = new http_1.default.Server(this.app);
    }
    static get instance() {
        return this._instance || (this._instance = new this());
    }
    start(callback) {
        this.httpServer.listen(this.port, callback);
    }
}
exports.default = ServerConfig;
