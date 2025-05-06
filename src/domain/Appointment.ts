export class Appointment {
    constructor(
      public readonly insuredId: string,
      public readonly scheduleId: number,
      public readonly countryISO: 'PE' | 'CL',
      public status: 'pending' | 'completed' = 'pending',
    ) {}
  }
  