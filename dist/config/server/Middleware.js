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
const Jws_1 = require("../tools/Jws");
const crypto_1 = __importDefault(require("crypto"));
const console_1 = require("console");
const simpleAuth = crypto_1.default.createHash('md5').update('aqui va tu contraseña').digest('hex');
(0, console_1.log)(simpleAuth);
const Middleware = (typeAuth) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        //respuesta de error estandar
        const error_res = { error: true, msg: 'no token' };
        try {
            const headers = req.headers;
            if (typeAuth === 0) {
                // autenticación simple que se basa en md5
                //comparamos el header simple con el md5 definido, si no coinciden manda error 401
                if (headers['simple'] !== simpleAuth)
                    return res.status(401).json(error_res);
            }
            else {
                if (!headers['authorization'] || !(yield Jws_1.Jwt.check(headers['authorization'])))
                    return res.status(401).json(error_res);
            }
            next();
        }
        catch (error) {
            return res.status(500).json(error_res);
        }
    });
};
exports.Middleware = Middleware;
