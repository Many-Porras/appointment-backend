// src/application/GetAppointmentsByInsuredIdUseCase.ts
import { getAppointmentsByInsuredId } from '../infrastructure/aws/AppointmentAWSService';

export class GetAppointmentsByInsuredIdUseCase {
  async execute(insuredId: string) {
    if (!insuredId) throw new Error('insuredId is required');
    const appointments = await getAppointmentsByInsuredId(insuredId);
    return appointments;
  }
}
