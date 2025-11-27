import { error } from "console";
import { connect } from "./DatabaseConection";
import { RowDataPacket, OkPacket } from 'mysql2/promise';

class DatabaseMethods {
    static async save(sql: { query: string; params?: any[] }){
        let connection;
        try {
            connection = await connect();
            await connection.execute(sql.query, sql.params);
            return {error: false, message: 'query executed successfully'};
        }
        catch (error) {
            return {error: true, message: 'error save query'};
        }
        finally {
            if (connection) connection.end();
        }
    }
    static async save_transaction(queries: { query: string; params: any[] }[]){
        let connection;
        try {
            connection = await connect();
            await connection.beginTransaction();
            for(let sql of queries){
                await connection.execute(sql.query, sql.params);
            }
            await connection.commit();
            return {error: false, msg: 'queries_excuted'};
        }catch (error) {
            if (connection) await connection.rollback();
            return {error: true, msg: 'error_save'};
        }finally{
            if (connection) connection.end();
        }
    }
}

export { DatabaseMethods };