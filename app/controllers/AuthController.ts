import { AuthModel } from "../models/AuthModel";
import { Utils } from "../../config/tools/Utils";
import { CustomExceptions } from "../../config/tools/CustomExceptions";

class AuthController {
    static async signUp(req: any, res: any) {
        try {
            const {name, email, password, phone} = req.body;
            if(Utils.hasEmptyParams([name, email, password, phone])) {
                throw new CustomExceptions('007')
            };
            const result = await AuthModel.signUp(name, email, password, phone);
            res.json(result);
        }
        catch (error) {
            if(error instanceof CustomExceptions) {
                res.status(400).json(error.GetOptions());
            } else {
                res.status(500).json({error: true, message: 'internal server error'});
            }
        }
    }
}
export { AuthController };