import jwt, {JwtPayload} from 'jsonwebtoken';

class Jwt {
    private static readonly key: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9@";
    private static readonly issuser: string = "https://localhost:4200";

    private static async signIn(data: any): Promise<string> {
        const payload = {
            data: data,
            iss: Jwt.issuser
        };
        const base64key = Buffer.from(Jwt.key).toString('base64');
        return jwt.sign(payload, base64key, { expiresIn: '1h' });  
    }

    public static async check(token: string): Promise<boolean> {
        try {
            const base64key = Buffer.from(Jwt.key).toString('base64');
            const decode = jwt.verify(token, base64key, {
                issuer: Jwt.issuser,
                ignoreExpiration: false
            }) as JwtPayload;
            return true;
        } catch (error) {
            return false;
        }
    }
}

export { Jwt };