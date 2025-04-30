import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcryptjs';

@Injectable()
export class PasswordService {

    async passwordHash(password: string): Promise<string>{

        const salt = await genSalt(10);

        return await hash(password, salt);
    }

    async comparePassword(password: string, passwordHashed: string): Promise<boolean>{

        return await compare(password, passwordHashed);
    }
}
