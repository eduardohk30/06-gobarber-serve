import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '../controllers/AppointmentsController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();

/*
 ** SoC: Separation of Concerns (Separação de preocupações)
 ** Não devemos centralizar várias reponsabilidades para uma rotina,
 ** o ideal é que cada arquivo fique responsável por uma tarefa específica
 */

/*
 * colocaremos esse middleware pois ele só deve permitir acessar as rotas
 * se a autenticação estiver de acordo
 */
appointmentsRouter.use(ensureAuthenticated);

// appointmentsRouter.get('/', async (request, response) => {
//     const appointments = await appointmentsRepository.find();

//     return response.json(appointments);
// });

appointmentsRouter.post('/', appointmentsController.create);

export default appointmentsRouter;
