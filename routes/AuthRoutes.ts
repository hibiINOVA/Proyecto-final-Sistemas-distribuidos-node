import e, { Router } from "express";
import { AuthController } from "../app/controllers/AuthController";
import { Middleware } from "../config/server/Middleware";

const router = Router();

router.post('/signup', Middleware(0), AuthController.signUp);

export default router;