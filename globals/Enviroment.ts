import dotenv from 'dotenv';
dotenv.config();

export const SERVER_PORT: number = Number(process.env.PORT) || 3000;

// MYSQL
export const HOST_MYSQL = process.env.HOST_MYSQL || 'localhost';
export const PORT_MYSQL = Number(process.env.PORT_MYSQL) || 3308;
export const USER_MYSQL = process.env.USER_MYSQL || 'root';
export const PASSWORD_MYSQL = process.env.PASSWORD_MYSQL || '12345';
export const DATABASE_MYSQL = process.env.DATABASE_MYSQL || 'proyecto_final';

// JWT
export const JWT_SECRET = process.env.JWT_SECRET || 'clave-secreta-para-jwt';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

// Pipedream
export const PIPEDREAM_CHECK_CODE_URL = process.env.PIPEDREAM_check_code_URL;
export const PIPEDREAM_SEND_CODE_URL = process.env.PIPEDREAM_send_code_URL;
export const PIPEDREAM_SEND_MAIL_URL = process.env.PIPEDREAM_send_mail_URL;
