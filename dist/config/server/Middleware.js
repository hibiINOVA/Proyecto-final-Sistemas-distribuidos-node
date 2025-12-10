"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Middleware = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const AuthService_1 = require("../../app/services/AuthService");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class Middleware {
    static validarToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
                if (!token) {
                    return res.status(401).json({
                        error: true,
                        msg: "Token requerido."
                    });
                }
                const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "default_secret");
                req.userId = decoded;
                next();
            }
            catch (err) {
                return res.status(403).json({
                    error: true,
                    msg: "Token inválido o expirado."
                });
            }
        });
    }
    static validarLogin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    return res.status(400).json({
                        error: true,
                        msg: "Faltan datos: email o password."
                    });
                }
                const user = yield AuthService_1.AuthService.getUserByEmail(email);
                if (!user) {
                    return res.status(404).json({
                        error: true,
                        msg: "Usuario no encontrado."
                    });
                }
                const coincide = yield bcrypt_1.default.compare(password, user.password);
                if (!coincide) {
                    return res.status(401).json({
                        error: true,
                        msg: "Contraseña incorrecta."
                    });
                }
                req.body.user = user;
                next();
            }
            catch (err) {
                console.error("Error en middleware:", err);
                return res.status(500).json({
                    error: true,
                    msg: "Error interno en middleware."
                });
            }
        });
    }
}
exports.Middleware = Middleware;
