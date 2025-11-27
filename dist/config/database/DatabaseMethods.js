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
exports.DatabaseMethods = void 0;
const DatabaseConection_1 = require("./DatabaseConection");
class DatabaseMethods {
    static save(sql) {
        return __awaiter(this, void 0, void 0, function* () {
            let connection;
            try {
                connection = yield (0, DatabaseConection_1.connect)();
                yield connection.execute(sql.query, sql.params);
                return { error: false, message: 'query executed successfully' };
            }
            catch (error) {
                return { error: true, message: 'error save query' };
            }
            finally {
                if (connection)
                    connection.end();
            }
        });
    }
    static save_transaction(queries) {
        return __awaiter(this, void 0, void 0, function* () {
            let connection;
            try {
                connection = yield (0, DatabaseConection_1.connect)();
                yield connection.beginTransaction();
                for (let sql of queries) {
                    yield connection.execute(sql.query, sql.params);
                }
                yield connection.commit();
                return { error: false, msg: 'queries_excuted' };
            }
            catch (error) {
                if (connection)
                    yield connection.rollback();
                return { error: true, msg: 'error_save' };
            }
            finally {
                if (connection)
                    connection.end();
            }
        });
    }
}
exports.DatabaseMethods = DatabaseMethods;
