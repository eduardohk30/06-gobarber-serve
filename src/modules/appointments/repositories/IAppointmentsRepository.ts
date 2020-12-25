import Appointment from '../infra/typeorm/entities/Appointment';
import ICreatAppointmentDTO from '../dtos/ICreateAppointmentDTO';

export default interface IAppointmentsRepository {
    create(data: ICreatAppointmentDTO): Promise<Appointment>;
    findByDate(date: Date): Promise<Appointment | undefined>;
}
