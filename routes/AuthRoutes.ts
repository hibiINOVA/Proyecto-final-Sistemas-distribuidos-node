import { Router } from "express";
import { AuthController } from "../app/controllers/AuthController";
import { Middleware } from "../config/server/Middleware";

const router = Router();

// Rutas públicas
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/sendcode", AuthController.sendCode);
router.post("/checkcode", AuthController.checkCode);
router.post("/changepassword", AuthController.changePassword);

// Rutas protegidas
router.put("/editarperfil/:id", Middleware.validarToken, AuthController.updateProfile);
router.get("/verify", Middleware.validarToken, AuthController.verifyToken);

export default router;
