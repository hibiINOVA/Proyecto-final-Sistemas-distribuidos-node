"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ServerConfig_1 = __importDefault(require("./config/server/ServerConfig"));
const cors_1 = __importDefault(require("cors"));
const server = ServerConfig_1.default.instance;
// CORS
server.app.use((0, cors_1.default)());
// Start
server.start();
