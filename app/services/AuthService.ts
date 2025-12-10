import { AuthModel, User } from "../models/AuthModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const JWT_SECRET = process.env.JWT_SECRET || "clave_super_segura";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

export class AuthService {

  static async getUserByEmail(email: string): Promise<User | null> {
    if (!email) return null;
    try {
      const user = await AuthModel.findByEmail(email);
      return user || null;
    } catch (error) {
      console.error("Error en getUserByEmail:", error);
      return null;
    }
  }

  static async register(data: {
    nombre: string;
    apellidos: string;
    email: string;
    password: string;
    telefono?: string | null;
  }) {
    if (!data.nombre || !data.apellidos || !data.email || !data.password) {
      return { error: true, msg: "Faltan datos obligatorios" };
    }

    const existing = await AuthModel.findByEmail(data.email);
    if (existing) {
      return { error: true, msg: "El correo ya está registrado" };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser: User = {
      id: uuidv4(),
      nombre: data.nombre,
      apellidos: data.apellidos,
      email: data.email,
      password: hashedPassword,
      telefono: data.telefono || null,
      activo: true,
    };

    const result = await AuthModel.register(newUser);
    if (result.error) {
      return { error: true, msg: "Error al registrar usuario" };
    }

    return {
      error: false,
      msg: "Usuario registrado correctamente",
      data: { id: newUser.id, email: newUser.email },
    };
  }

  static async login(email: string, password: string) {
    const user = await AuthModel.findByEmail(email);
    if (!user) {
      return { error: true, msg: "Credenciales inválidas" };
    }

    const correct = await bcrypt.compare(password, user.password);
    if (!correct) {
      return { error: true, msg: "Credenciales inválidas" };
    }

    await AuthModel.updateLastSession(user.id);

    const payload = {
      id: user.id,
      nombre: user.nombre,
      apellidos: user.apellidos,
      email: user.email,
    };
    
    const token = jwt.sign(payload, JWT_SECRET, { 
      expiresIn: JWT_EXPIRES_IN as any 
    });

    return {
      error: false,
      msg: "Login correcto",
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        apellidos: user.apellidos,
        email: user.email,
        telefono: user.telefono,
        activo: user.activo,
      },
    };
  }

  static async updateProfile(id: string, data: Partial<User>) {
    const user = await AuthModel.findById(id);
    if (!user) {
      return { error: true, msg: "Usuario no encontrado" };
    }

    const fields: string[] = [];
    const params: any[] = [];

    if (data.nombre) {
      fields.push("nombre = ?");
      params.push(data.nombre);
    }
    if (data.apellidos) {
      fields.push("apellidos = ?");
      params.push(data.apellidos);
    }
    if (data.telefono !== undefined) {
      fields.push("telefono = ?");
      params.push(data.telefono);
    }

    if (fields.length === 0) {
      return { error: true, msg: "No hay datos para actualizar" };
    }

    params.push(id);

    const sql = {
      query: `
        UPDATE users
        SET ${fields.join(", ")}
        WHERE id = ?
      `,
      params,
    };

    const update = await AuthModel.update(sql);
    if (update.error) {
      return { error: true, msg: "Error actualizando perfil" };
    }

    return { error: false, msg: "Perfil actualizado correctamente" };
  }

  static verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");
      return decoded as any;
    } catch (err) {
      console.error("Error verificando token:", err);
      return null;
    }
  }

  static async changePassword(email: string, newPassword: string) {
    const user = await AuthModel.findByEmail(email);
    if (!user) {
      return { error: true, msg: "Usuario no encontrado" };
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    const sql = {
      query: `
        UPDATE users
        SET password = ?
        WHERE email = ?
      `,
      params: [hashed, email],
    };

    const update = await AuthModel.update(sql);

    if (update.error) {
      return { error: true, msg: "Error actualizando contraseña" };
    }

    return { error: false };
  }

  static async getUserById(id: string): Promise<User | null> {
  if (!id) return null;

  try {
    const user = await AuthModel.findById(id);
    return user || null;
  } catch (error) {
    console.error("Error en getUserById:", error);
    return null;
  }
}


}
