import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import { AuthService } from "../../app/services/AuthService";
import jwt from "jsonwebtoken";

export class Middleware {

    static async validarToken(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.headers.authorization?.split(" ")[1];

            if (!token) {
                return res.status(401).json({
                    error: true,
                    msg: "Token requerido."
                });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");

            (req as any).userId = decoded;

            next();

        } catch (err) {
            return res.status(403).json({
                error: true,
                msg: "Token inválido o expirado."
            });
        }
    }

    static async validarLogin(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    error: true,
                    msg: "Faltan datos: email o password."
                });
            }

            const user = await AuthService.getUserByEmail(email);

            if (!user) {
                return res.status(404).json({
                    error: true,
                    msg: "Usuario no encontrado."
                });
            }

            const coincide = await bcrypt.compare(password, user.password);

            if (!coincide) {
                return res.status(401).json({
                    error: true,
                    msg: "Contraseña incorrecta."
                });
            }

            req.body.user = user;
            next();

        } catch (err) {
            console.error("Error en middleware:", err);
            return res.status(500).json({
                error: true,
                msg: "Error interno en middleware."
            });
        }
    }

}