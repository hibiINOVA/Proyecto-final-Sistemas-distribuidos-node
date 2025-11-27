"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomExceptions = void 0;
class CustomExceptions extends Error {
    constructor(errorCode) {
        super();
        this.errorCode = errorCode || "000";
        this.message = this.getMessage(errorCode);
    }
    getMessage(errorCode) {
        const MESSAGE_CATALOGUE = {
            "001": "incorrect_request_method",
            "002": "incorrect_class",
            "003": "method_not_exist",
            "004": "no_user",
            "005": "invalid_credentials",
            "006": "not_token",
            "007": "empty_params",
        };
        return MESSAGE_CATALOGUE[errorCode] || "unknown_error";
    }
    GetOptions() {
        return { error: true, msg: this.message, error_code: this.errorCode };
    }
}
exports.CustomExceptions = CustomExceptions;
