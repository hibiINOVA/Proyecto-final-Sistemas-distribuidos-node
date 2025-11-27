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
exports.Jwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class Jwt {
    static signIn(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = {
                data: data,
                iss: Jwt.issuser
            };
            const base64key = Buffer.from(Jwt.key).toString('base64');
            return jsonwebtoken_1.default.sign(payload, base64key, { expiresIn: '1h' });
        });
    }
    static check(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const base64key = Buffer.from(Jwt.key).toString('base64');
                const decode = jsonwebtoken_1.default.verify(token, base64key, {
                    issuer: Jwt.issuser,
                    ignoreExpiration: false
                });
                return true;
            }
            catch (error) {
                return false;
            }
        });
    }
}
exports.Jwt = Jwt;
Jwt.key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9@";
Jwt.issuser = "https://localhost:4200";
