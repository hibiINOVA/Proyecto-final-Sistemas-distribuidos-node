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
const AuthService_1 = require("../services/AuthService");
const Utils_1 = require("../../config/tools/Utils");
class AuthModel {
    static signUp(name, email, password, phone) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = Utils_1.Utils.UUID();
            const password_with_hash = yield Utils_1.Utils.hash(password);
            return yield AuthService_1.AuthService.signUp(id, name, email, password_with_hash, phone);
        });
    }
}
exports.AuthModel = AuthModel;
