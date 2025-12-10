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
exports.AuthService = void 0;
const AuthModel_1 = require("../models/AuthModel");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const JWT_SECRET = process.env.JWT_SECRET || "clave_super_segura";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
class AuthService {
    static getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email)
                return null;
            try {
                const user = yield AuthModel_1.AuthModel.findByEmail(email);
                return user || null;
            }
            catch (error) {
                console.error("Error en getUserByEmail:", error);
                return null;
            }
        });
    }
    static register(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.nombre || !data.apellidos || !data.email || !data.password) {
                return { error: true, msg: "Faltan datos obligatorios" };
            }
            const existing = yield AuthModel_1.AuthModel.findByEmail(data.email);
            if (existing) {
                return { error: true, msg: "El correo ya está registrado" };
            }
            const hashedPassword = yield bcryptjs_1.default.hash(data.password, 10);
            const newUser = {
                id: (0, uuid_1.v4)(),
                nombre: data.nombre,
                apellidos: data.apellidos,
                email: data.email,
                password: hashedPassword,
                telefono: data.telefono || null,
                activo: true,
            };
            const result = yield AuthModel_1.AuthModel.register(newUser);
            if (result.error) {
                return { error: true, msg: "Error al registrar usuario" };
            }
            return {
                error: false,
                msg: "Usuario registrado correctamente",
                data: { id: newUser.id, email: newUser.email },
            };
        });
    }
    static login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield AuthModel_1.AuthModel.findByEmail(email);
            if (!user) {
                return { error: true, msg: "Credenciales inválidas" };
            }
            const correct = yield bcryptjs_1.default.compare(password, user.password);
            if (!correct) {
                return { error: true, msg: "Credenciales inválidas" };
            }
            yield AuthModel_1.AuthModel.updateLastSession(user.id);
            const payload = {
                id: user.id,
                nombre: user.nombre,
                apellidos: user.apellidos,
                email: user.email,
            };
            const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, {
                expiresIn: JWT_EXPIRES_IN
            });
            return {
                error: false,
                msg: "Login correcto",
                token,
                user: {
                    id: user.id,
                    nombre: user.nombre,
                    apellidos: user.apellidos,
                    email: user.email,
                    telefono: user.telefono,
                    activo: user.activo,
                },
            };
        });
    }
    static updateProfile(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield AuthModel_1.AuthModel.findById(id);
            if (!user) {
                return { error: true, msg: "Usuario no encontrado" };
            }
            const fields = [];
            const params = [];
            if (data.nombre) {
                fields.push("nombre = ?");
                params.push(data.nombre);
            }
            if (data.apellidos) {
                fields.push("apellidos = ?");
                params.push(data.apellidos);
            }
            if (data.telefono !== undefined) {
                fields.push("telefono = ?");
                params.push(data.telefono);
            }
            if (fields.length === 0) {
                return { error: true, msg: "No hay datos para actualizar" };
            }
            params.push(id);
            const sql = {
                query: `
        UPDATE users
        SET ${fields.join(", ")}
        WHERE id = ?
      `,
                params,
            };
            const update = yield AuthModel_1.AuthModel.update(sql);
            if (update.error) {
                return { error: true, msg: "Error actualizando perfil" };
            }
            return { error: false, msg: "Perfil actualizado correctamente" };
        });
    }
    static verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "secret123");
            return decoded;
        }
        catch (err) {
            console.error("Error verificando token:", err);
            return null;
        }
    }
    static changePassword(email, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield AuthModel_1.AuthModel.findByEmail(email);
            if (!user) {
                return { error: true, msg: "Usuario no encontrado" };
            }
            const hashed = yield bcryptjs_1.default.hash(newPassword, 10);
            const sql = {
                query: `
        UPDATE users
        SET password = ?
        WHERE email = ?
      `,
                params: [hashed, email],
            };
            const update = yield AuthModel_1.AuthModel.update(sql);
            if (update.error) {
                return { error: true, msg: "Error actualizando contraseña" };
            }
            return { error: false };
        });
    }
    static getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id)
                return null;
            try {
                const user = yield AuthModel_1.AuthModel.findById(id);
                return user || null;
            }
            catch (error) {
                console.error("Error en getUserById:", error);
                return null;
            }
        });
    }
}
exports.AuthService = AuthService;
