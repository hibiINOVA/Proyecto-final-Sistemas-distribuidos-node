"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PIPEDREAM_SEND_MAIL_URL = exports.PIPEDREAM_SEND_CODE_URL = exports.PIPEDREAM_CHECK_CODE_URL = exports.JWT_EXPIRES_IN = exports.JWT_SECRET = exports.DATABASE_MYSQL = exports.PASSWORD_MYSQL = exports.USER_MYSQL = exports.PORT_MYSQL = exports.HOST_MYSQL = exports.SERVER_PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.SERVER_PORT = Number(process.env.PORT) || 3000;
// MYSQL
exports.HOST_MYSQL = process.env.HOST_MYSQL || 'localhost';
exports.PORT_MYSQL = Number(process.env.PORT_MYSQL) || 3308;
exports.USER_MYSQL = process.env.USER_MYSQL || 'root';
exports.PASSWORD_MYSQL = process.env.PASSWORD_MYSQL || '12345';
exports.DATABASE_MYSQL = process.env.DATABASE_MYSQL || 'proyecto_final';
// JWT
exports.JWT_SECRET = process.env.JWT_SECRET || 'clave-secreta-para-jwt';
exports.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
// Pipedream
exports.PIPEDREAM_CHECK_CODE_URL = process.env.PIPEDREAM_check_code_URL;
exports.PIPEDREAM_SEND_CODE_URL = process.env.PIPEDREAM_send_code_URL;
exports.PIPEDREAM_SEND_MAIL_URL = process.env.PIPEDREAM_send_mail_URL;
