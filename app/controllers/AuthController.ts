import { Request, Response } from "express";
import axios from "axios";
import { AuthService } from "../services/AuthService";
  
const passwordResetPermissions = new Map<string, number>();

export class AuthController {
  //  REGISTRO
  static async register(req: Request, res: Response) {
    try {
      const result = await AuthService.register(req.body);

      if (result.error) {
        return res.status(400).json(result);
      }

      // -------------------- llamar API .NET --------------------
      const dotnetUrl = "http://localhost:5020/api/pipedream/welcome";

      const payload = {
        Email: req.body.email,
        UserName: `${req.body.nombre} ${req.body.apellidos}`.trim()
      };

      axios
        .post(dotnetUrl, payload)
        .then(() => console.log("Webhook enviado a .NET ✔️"))
        .catch((err) =>
          console.error("Error enviando webhook a .NET:", err.message)
        );
      // ----------------------------------------------------------------

      return res.status(201).json(result);

    } catch (error) {
      console.error("Error en register:", error);
      return res.status(500).json({
        error: true,
        msg: "Error interno en registro",
      });
    }
  }

  //  LOGIN
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          error: true,
          msg: "Email y contraseña son obligatorios",
        });
      }

      const result = await AuthService.login(email, password);

      if (result.error) {
        return res.status(401).json(result);
      }

      return res.json(result);
    } catch (error) {
      console.error("Error en login:", error);
      return res.status(500).json({
        error: true,
        msg: "Error interno en login",
      });
    }
  }

  //  ACTUALIZAR PERFIL
  static async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.params.id || (req as any).user?.id;

      if (!userId) {
        return res.status(400).json({
          error: true,
          msg: "ID de usuario no proporcionado",
        });
      }

      const data = req.body;

      const result = await AuthService.updateProfile(userId, data);

      if (result.error) {
        return res.status(400).json(result);
      }

      return res.json(result);

    } catch (error) {
      console.error("Error en updateProfile:", error);
      return res.status(500).json({
        error: true,
        msg: "Error interno al actualizar el perfil",
      });
    }
  }

  //  VERIFICAR TOKEN
  static async verifyToken(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          error: true,
          msg: "Token no proporcionado o formato inválido",
        });
      }

      const token = authHeader.split(" ")[1];

      if (!token) {
        return res.status(401).json({
          error: true,
          msg: "Token no proporcionado",
        });
      }

      const decoded = AuthService.verifyToken(token);

      if (!decoded) {
        return res.status(401).json({
          error: true,
          msg: "Token inválido o expirado",
        });
      }

      const user = await AuthService.getUserById(decoded.id);

      return res.json({
        error: false,
        msg: "Token válido",
        user
      });

    } catch (error) {
      console.error("Error en verifyToken:", error);
      return res.status(500).json({
        error: true,
        msg: "Error interno al verificar token",
      });
    }
  }


  //  ENVIAR CÓDIGO
  static async sendCode(req: Request, res: Response) {
    try {
      const { email, nombre } = req.body;

      if (!email || !nombre) {
        return res.status(400).json({
          error: true,
          msg: "Email y nombre son obligatorios",
        });
      }

      // ruta del servicio .NET
      const apiUrl = "http://localhost:5020/api/pipedream/sendcode";

      const payload = {
        Email: email,
        UserName: nombre
      };

      await axios.post(apiUrl, payload);

      return res.json({
        error: false,
        msg: "Código enviado correctamente",
      });

    } catch (error: any) {
      console.error("Error enviando código:", error.message);

      return res.status(500).json({
        error: true,
        msg: "No se pudo enviar el código",
      });
    }
  }

  // VERIFICAR CÓDIGO
  static async checkCode(req: Request, res: Response) {
    try {
      const { key, value } = req.body;

      if (!key || !value) {
        return res.status(400).json({
          error: true,
          msg: "Key y value son obligatorios",
        });
      }

      const apiUrl = "http://localhost:5020/api/pipedream/checkcode";

      const payload = {
        Key: key,
        Value: value
      };

      const response = await axios.post(apiUrl, payload);

      // Guardar permiso temporal por 10 min
      const expiresAt = Date.now() + 10 * 60 * 1000;
      passwordResetPermissions.set(key.toLowerCase(), expiresAt);

      return res.json({
        error: false,
        msg: "Código verificado correctamente",
        data: response.data
      });

    } catch (error: any) {
      console.error("Error verificando código:", error.message);

      return res.status(500).json({
        error: true,
        msg: "No se pudo verificar el código",
      });
    }
  }

  static async changePassword(req: Request, res: Response) {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        error: true,
        msg: "Email y nueva contraseña son obligatorios",
      });
    }

    const emailKey = email.toLowerCase();

    // Verificar permiso del checkCode
    const allowedUntil = passwordResetPermissions.get(emailKey);

    if (!allowedUntil || allowedUntil < Date.now()) {
      return res.status(403).json({
        error: true,
        msg: "No tienes autorización para cambiar la contraseña. Verifica el código primero.",
      });
    }

    // Borrar permiso
    passwordResetPermissions.delete(emailKey);

    const result = await AuthService.changePassword(email, newPassword);

    if (result.error) {
      return res.status(400).json(result);
    }

    return res.json({
      error: false,
      msg: "Contraseña actualizada correctamente"
    });

  } catch (error: any) {
    console.error("Error en changePassword:", error.message);
    return res.status(500).json({
      error: true,
      msg: "No se pudo cambiar la contraseña",
    });
  }
}

}
