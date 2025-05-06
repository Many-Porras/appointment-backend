// src/infrastructure/lambda/appointment.ts
import { APIGatewayProxyHandler } from 'aws-lambda';
import { CreateAppointmentUseCase } from '../../application/CreateAppointmentUseCase';
import { GetAppointmentsByInsuredIdUseCase } from '../../application/GetAppointmentsByInsuredIdUseCase';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const useCase = new CreateAppointmentUseCase();
      const result = await useCase.execute(body);

      return {
        statusCode: 201,
        body: JSON.stringify(result),
      };
    }

    if (event.httpMethod === 'GET') {
      const insuredId = event.pathParameters?.insuredId;
      const useCase = new GetAppointmentsByInsuredIdUseCase();
      const result = await useCase.execute(insuredId!);

      return {
        statusCode: 200,
        body: JSON.stringify(result),
      };
    }

    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
