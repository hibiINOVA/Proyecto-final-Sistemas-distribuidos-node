import {Request, Response, NextFunction} from 'express';
import { Jwt } from '../tools/Jws';
import crypto from 'crypto';
import { log } from 'console';

const simpleAuth = crypto.createHash('md5').update('aqui va tu contraseña').digest('hex');
log(simpleAuth)

const Middleware = (typeAuth: number) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        //respuesta de error estandar
        const error_res = {error: true, msg: 'no token'};
        try {
            const headers = req.headers;
            if(typeAuth === 0){
                // autenticación simple que se basa en md5
                //comparamos el header simple con el md5 definido, si no coinciden manda error 401
                if(headers['simple'] !== simpleAuth) return res.status(401).json(error_res);
            }else {
                if(!headers['authorization'] || !await Jwt.check(headers['authorization'])) return res.status(401).json(error_res);
            }
            next();
        }catch (error) {
            return  res.status(500).json(error_res);
        }
    }
}

export { Middleware };