import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';

import User from '../infra/typeorm/entities/User';

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    user: User;
    token: string;
}

@injectable()
class AuthenticateUserService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
    ) {}

    public async execute({ email, password }: IRequest): Promise<IResponse> {
        const user = await this.usersRepository.findByEmail(email);

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
