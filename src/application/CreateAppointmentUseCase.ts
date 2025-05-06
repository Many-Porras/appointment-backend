import { Appointment } from '../domain/Appointment';
import { saveToDynamoDB, publishToSNS } from '../infrastructure/aws/AppointmentAWSService';

export class CreateAppointmentUseCase {
  async execute(input: {
    insuredId: string;
    scheduleId: number;
    countryISO: string;
  }) {
    // Validación básica
    if (!['PE', 'CL'].includes(input.countryISO)) throw new Error('Invalid country');

    const appointment = new Appointment(
      input.insuredId,
      input.scheduleId,
      input.countryISO as 'PE' | 'CL',
    );

    // Guardar en DynamoDB
    await saveToDynamoDB(appointment);

    // Publicar en SNS
    await publishToSNS(appointment);

    return {
      message: 'Agendamiento en proceso',
      appointmentId: appointment.scheduleId,
    };
  }
}
