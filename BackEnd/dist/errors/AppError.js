"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    constructor(message, statusCode = 400) {
        var _a;
        super(message);
        this.statusCode = statusCode;
        this.name = "AppError";
        (_a = Error.captureStackTrace) === null || _a === void 0 ? void 0 : _a.call(Error, this, this.constructor);
    }
}
exports.default = AppError;
