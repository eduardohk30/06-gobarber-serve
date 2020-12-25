import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';

interface TokenPayLoad {
    iat: number;
    exp: number;
    sub: string;
}

export default function ensureAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction,
): void {
    // Validação do token JWT
    const authHeader = request.headers.authorization;
    if (!authHeader) {
        throw new AppError('JWT Token is missing', 401);
    }

    // formato de saída do header: Bearer <Token>

    /*
     * O formado de saida do authHeader.split(' ');
     * será o Bearer <Token> como não precisaremos
     * da primeira variável que será sempre Bearer
     * nós só colocamos a virgula "," o typescript
     * vai entender que não precisamos da primeira
     * variavel e só vai criar a variável token
     */
    const [, token] = authHeader.split(' ');

    // aqui fazermos a verificação do token pra ver se está tudo certo:
    try {
        const decoded = verify(token, authConfig.jwt.secret);

        /**
         * Como Haviamos configurado na geração do token, o sub
         * sempre irá conter o id do usuário, nós iremos utilizar
         * esse id pois não faz sentido o usuário poder visualizar
         * os appointments de outros usuários, então usaremos esse
         * id retornado como filtro em várias das nossas rotas
         */
        const { sub } = decoded as TokenPayLoad;

        /*
         * Não existe a variável user em request, para incluirmos
         * faremos um hack e adicionaremos essa variavel adicionando
         * uma nova definição, para isso, criaremos dentro da pasta
         * src/@types um arquivo chamado express.d.ts, pois
         * estamos adicionando uma variavel no express, por isso o nome
         * e dentro desse arquivo devemos colocar o seguinte código:
         *
         * declare namespace Express {
         *    export interface Request {
         *        user: {
         *            id: string;
         *        };
         *    }
         *}
         *
         * Agora graças a isso termos o id do usuário em todas as
         * nossas rotas!!!
         */
        request.user = {
            id: sub,
        };

        return next();
    } catch {
        throw new AppError('Invalid JWT token', 401);
    }
}
