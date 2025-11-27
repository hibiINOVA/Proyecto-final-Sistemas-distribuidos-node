"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ServerConfig_1 = __importDefault(require("./config/server/ServerConfig"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const AuthRoutes_1 = __importDefault(require("./routes/AuthRoutes"));
const server = ServerConfig_1.default.instance;
// Body parser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
// CORS
server.app.use((0, cors_1.default)());
server.app.use('/auth', AuthRoutes_1.default);
// Start server
server.start(() => {
    console.log(`Server running on port ${server.port}`);
});
