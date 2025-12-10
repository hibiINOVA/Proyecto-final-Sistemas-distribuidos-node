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
exports.AuthController = void 0;
const axios_1 = __importDefault(require("axios"));
const AuthService_1 = require("../services/AuthService");
const passwordResetPermissions = new Map();
class AuthController {
    //  REGISTRO
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield AuthService_1.AuthService.register(req.body);
                if (result.error) {
                    return res.status(400).json(result);
                }
                // -------------------- llamar API .NET --------------------
                const dotnetUrl = "http://localhost:5020/api/pipedream/welcome";
                const payload = {
                    Email: req.body.email,
                    UserName: `${req.body.nombre} ${req.body.apellidos}`.trim()
                };
                axios_1.default
                    .post(dotnetUrl, payload)
                    .then(() => console.log("Webhook enviado a .NET ✔️"))
                    .catch((err) => console.error("Error enviando webhook a .NET:", err.message));
                // ----------------------------------------------------------------
                return res.status(201).json(result);
            }
            catch (error) {
                console.error("Error en register:", error);
                return res.status(500).json({
                    error: true,
                    msg: "Error interno en registro",
                });
            }
        });
    }
    //  LOGIN
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    return res.status(400).json({
                        error: true,
                        msg: "Email y contraseña son obligatorios",
                    });
                }
                const result = yield AuthService_1.AuthService.login(email, password);
                if (result.error) {
                    return res.status(401).json(result);
                }
                return res.json(result);
            }
            catch (error) {
                console.error("Error en login:", error);
                return res.status(500).json({
                    error: true,
                    msg: "Error interno en login",
                });
            }
        });
    }
    //  ACTUALIZAR PERFIL
    static updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = req.params.id || ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
                if (!userId) {
                    return res.status(400).json({
                        error: true,
                        msg: "ID de usuario no proporcionado",
                    });
                }
                const data = req.body;
                const result = yield AuthService_1.AuthService.updateProfile(userId, data);
                if (result.error) {
                    return res.status(400).json(result);
                }
                return res.json(result);
            }
            catch (error) {
                console.error("Error en updateProfile:", error);
                return res.status(500).json({
                    error: true,
                    msg: "Error interno al actualizar el perfil",
                });
            }
        });
    }
    //  VERIFICAR TOKEN
    static verifyToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authHeader = req.headers.authorization;
                if (!authHeader || !authHeader.startsWith("Bearer ")) {
                    return res.status(401).json({
                        error: true,
                        msg: "Token no proporcionado o formato inválido",
                    });
                }
                const token = authHeader.split(" ")[1];
                if (!token) {
                    return res.status(401).json({
                        error: true,
                        msg: "Token no proporcionado",
                    });
                }
                const decoded = AuthService_1.AuthService.verifyToken(token);
                if (!decoded) {
                    return res.status(401).json({
                        error: true,
                        msg: "Token inválido o expirado",
                    });
                }
                const user = yield AuthService_1.AuthService.getUserById(decoded.id);
                return res.json({
                    error: false,
                    msg: "Token válido",
                    user
                });
            }
            catch (error) {
                console.error("Error en verifyToken:", error);
                return res.status(500).json({
                    error: true,
                    msg: "Error interno al verificar token",
                });
            }
        });
    }
    //  ENVIAR CÓDIGO
    static sendCode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, nombre } = req.body;
                if (!email || !nombre) {
                    return res.status(400).json({
                        error: true,
                        msg: "Email y nombre son obligatorios",
                    });
                }
                // ruta del servicio .NET
                const apiUrl = "http://localhost:5020/api/pipedream/sendcode";
                const payload = {
                    Email: email,
                    UserName: nombre
                };
                yield axios_1.default.post(apiUrl, payload);
                return res.json({
                    error: false,
                    msg: "Código enviado correctamente",
                });
            }
            catch (error) {
                console.error("Error enviando código:", error.message);
                return res.status(500).json({
                    error: true,
                    msg: "No se pudo enviar el código",
                });
            }
        });
    }
    // VERIFICAR CÓDIGO
    static checkCode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { key, value } = req.body;
                if (!key || !value) {
                    return res.status(400).json({
                        error: true,
                        msg: "Key y value son obligatorios",
                    });
                }
                const apiUrl = "http://localhost:5020/api/pipedream/checkcode";
                const payload = {
                    Key: key,
                    Value: value
                };
                const response = yield axios_1.default.post(apiUrl, payload);
                // Guardar permiso temporal por 10 min
                const expiresAt = Date.now() + 10 * 60 * 1000;
                passwordResetPermissions.set(key.toLowerCase(), expiresAt);
                return res.json({
                    error: false,
                    msg: "Código verificado correctamente",
                    data: response.data
                });
            }
            catch (error) {
                console.error("Error verificando código:", error.message);
                return res.status(500).json({
                    error: true,
                    msg: "No se pudo verificar el código",
                });
            }
        });
    }
    static changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, newPassword } = req.body;
                if (!email || !newPassword) {
                    return res.status(400).json({
                        error: true,
                        msg: "Email y nueva contraseña son obligatorios",
                    });
                }
                const emailKey = email.toLowerCase();
                // Verificar permiso del checkCode
                const allowedUntil = passwordResetPermissions.get(emailKey);
                if (!allowedUntil || allowedUntil < Date.now()) {
                    return res.status(403).json({
                        error: true,
                        msg: "No tienes autorización para cambiar la contraseña. Verifica el código primero.",
                    });
                }
                // Borrar permiso
                passwordResetPermissions.delete(emailKey);
                const result = yield AuthService_1.AuthService.changePassword(email, newPassword);
                if (result.error) {
                    return res.status(400).json(result);
                }
                return res.json({
                    error: false,
                    msg: "Contraseña actualizada correctamente"
                });
            }
            catch (error) {
                console.error("Error en changePassword:", error.message);
                return res.status(500).json({
                    error: true,
                    msg: "No se pudo cambiar la contraseña",
                });
            }
        });
    }
}
exports.AuthController = AuthController;
