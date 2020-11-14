import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import authConfig from '../config/auth';
import User from '../models/Users';
import AppError from '../errors/AppError';

interface Request {
    email: string;
    password: string;
}

interface Response {
    user: User;
    token: string;
}

class AuthenticateUserService {
    public async execute({ email, password }: Request): Promise<Response> {
        const usersRepository = getRepository(User);

        const user = await usersRepository.findOne({ where: { email } });

        if (!user) {
            throw new AppError('Incorrect mail/password combination.', 401);
        }

        // user.password - senha criptografada
        // password - senha que o usuario digitou para informar o login (não criptografada)

        const passwordMatched = await compare(password, user.password);

        if (!passwordMatched) {
            throw new AppError('Incorrect mail/password combination.', 401);
        }

        const { secret, expiresIn } = authConfig.jwt;

        /*
         * Vamos informar o payload do token:
         * O primeiro parametro colocamos alguma informação referente ao usuario
         * devemos ter em mente que essa informação não é segura, então o que as
         * pessoas costumam colocar geralmente são informações sobre os acessos que
         * o usuário possui
         * O segundo parametro é uma chave para descriptografia, um conselho e
         * visitar o site md5.cz e digitar uma sequencia de strings que ele irá gerar
         * um hash com essa sequencia
         *O terceiro parametro são configurações diversas que descreveremos abaixo
         */
        const token = sign({}, secret, {
            subject: user.id, // id do usuário que gerou esse token
            expiresIn, // tempo em que esse token deve durar
        });

        return { user, token };
    }
}

export default AuthenticateUserService;
