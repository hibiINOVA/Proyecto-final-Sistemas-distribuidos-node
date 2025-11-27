import { DatabaseMethods } from "../../config/database/DatabaseMethods";
import { CustomExceptions } from "../../config/tools/CustomExceptions";
import { Utils } from "../../config/tools/Utils";

class AuthService {
    static async signUp(id: string, name:string, email: string, password: string, phone: string) {
        const queries = [
            {
                query: 'INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password`) VALUES (?, ?, ?, ?, ?, ?)',
                params: [id, name, email, phone, password]
            }
        ];
        return await DatabaseMethods.save_transaction(queries);
    }
}
export { AuthService };