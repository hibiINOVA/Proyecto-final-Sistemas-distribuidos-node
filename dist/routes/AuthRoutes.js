"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../app/controllers/AuthController");
const Middleware_1 = require("../config/server/Middleware");
const router = (0, express_1.Router)();
// Rutas públicas
router.post("/register", AuthController_1.AuthController.register);
router.post("/login", AuthController_1.AuthController.login);
router.post("/sendcode", AuthController_1.AuthController.sendCode);
router.post("/checkcode", AuthController_1.AuthController.checkCode);
router.post("/changepassword", AuthController_1.AuthController.changePassword);
// Rutas protegidas
router.put("/editarperfil/:id", Middleware_1.Middleware.validarToken, AuthController_1.AuthController.updateProfile);
router.get("/verify", Middleware_1.Middleware.validarToken, AuthController_1.AuthController.verifyToken);
exports.default = router;
