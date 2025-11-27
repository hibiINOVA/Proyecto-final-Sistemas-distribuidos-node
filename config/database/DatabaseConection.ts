import mysql, { Connection } from 'mysql2/promise';
import { HOST_MYSQL, USER_MYSQL, PASSWORD_MYSQL, DATABASE_MYSQL, PORT_MYSQL } from '../../globals/Enviroment';

const dbConfig = {
    port: PORT_MYSQL,
    host: HOST_MYSQL,
    user: USER_MYSQL,
    password: PASSWORD_MYSQL,
    database: DATABASE_MYSQL,
};

const connect = async (): Promise<Connection> => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Database connected successfully.');
        return connection;
    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw new Error('Database connection failed');
    }
}

export { connect };
