import { AuthService } from "../services/AuthService";
import { Utils } from "../../config/tools/Utils";
import { Jwt } from "../../config/tools/Jws";
import { CustomExceptions } from "../../config/tools/CustomExceptions";

class AuthModel {
    static async signUp(name:string, email: string, password: string, phone: string) {
        const id = Utils.UUID();
        const password_with_hash = await Utils.hash(password);
        return await AuthService.signUp(id, name, email, password_with_hash, phone);
    }
}

export { AuthModel };