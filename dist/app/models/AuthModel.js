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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModel = void 0;
const DatabaseMethods_1 = require("../../config/database/DatabaseMethods");
class AuthModel {
    static findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = {
                query: "SELECT * FROM users WHERE email = ? LIMIT 1",
                params: [email],
            };
            const result = yield DatabaseMethods_1.DatabaseMethods.query_one(sql);
            if (result.error)
                return null;
            return result.msg;
        });
    }
    static register(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = {
                query: `
        INSERT INTO users
        (id, nombre, apellidos, email, password, telefono)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
                params: [
                    user.id,
                    user.nombre,
                    user.apellidos,
                    user.email,
                    user.password,
                    user.telefono || null,
                ],
            };
            return yield DatabaseMethods_1.DatabaseMethods.save(sql);
        });
    }
    static updateLastSession(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = {
                query: `
        UPDATE users
        SET fecha_ultima_sesion = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
                params: [id],
            };
            return yield DatabaseMethods_1.DatabaseMethods.save(sql);
        });
    }
    static update(sql) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DatabaseMethods_1.DatabaseMethods.save(sql);
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = {
                query: "SELECT * FROM users WHERE id = ? LIMIT 1",
                params: [id],
            };
            const result = yield DatabaseMethods_1.DatabaseMethods.query_one(sql);
            if (result.error)
                return null;
            return result.msg;
        });
    }
}
exports.AuthModel = AuthModel;
