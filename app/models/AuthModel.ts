import { DatabaseMethods } from "../../config/database/DatabaseMethods";

export interface User {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  telefono?: string | null;
  fecha_registro?: string;
  fecha_ultima_sesion?: string | null;
  activo?: boolean;
}

class AuthModel {

  static async findByEmail(email: string): Promise<User | null> {
    const sql = {
      query: "SELECT * FROM users WHERE email = ? LIMIT 1",
      params: [email],
    };

    const result = await DatabaseMethods.query_one(sql);
    if (result.error) return null;
    return result.msg as User;
  }

  static async register(user: User) {
    const sql = {
      query: `
        INSERT INTO users
        (id, nombre, apellidos, email, password, telefono)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      params: [
        user.id,
        user.nombre,
        user.apellidos,
        user.email,
        user.password,
        user.telefono || null,
      ],
    };

    return await DatabaseMethods.save(sql);
  }

  static async updateLastSession(id: string) {
    const sql = {
      query: `
        UPDATE users
        SET fecha_ultima_sesion = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      params: [id],
    };

    return await DatabaseMethods.save(sql);
  }

  static async update(sql: { query: string; params: any[] }) {
    return await DatabaseMethods.save(sql);
  }

  static async findById(id: string): Promise<User | null> {
    const sql = {
      query: "SELECT * FROM users WHERE id = ? LIMIT 1",
      params: [id],
    };

    const result = await DatabaseMethods.query_one(sql);
    if (result.error) return null;
    return result.msg as User;
  }
}

export { AuthModel };
