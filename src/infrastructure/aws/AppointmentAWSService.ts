// src/infrastructure/aws/AppointmentAWSService.ts
import { DynamoDB, SNS } from 'aws-sdk';
import { Appointment } from '../../domain/Appointment';

const dynamoDb = new DynamoDB.DocumentClient();
const sns = new SNS();

const DYNAMODB_TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'Appointments';
const SNS_TOPIC_ARN_PE = process.env.SNS_TOPIC_ARN_PE || 'arn:aws:sns:region:account-id:SNS_PE';
const SNS_TOPIC_ARN_CL = process.env.SNS_TOPIC_ARN_CL || 'arn:aws:sns:region:account-id:SNS_CL';

export const saveToDynamoDB = async (appointment: Appointment): Promise<void> => {
  const params = {
    TableName: DYNAMODB_TABLE_NAME,
    Item: {
      insuredId: appointment.insuredId,
      scheduleId: appointment.scheduleId,
      countryISO: appointment.countryISO,
      status: appointment.status,
      createdAt: new Date().toISOString()
    },
  };
  await dynamoDb.put(params).promise();
};

export const publishToSNS = async (appointment: Appointment): Promise<void> => {
  const topicArn = appointment.countryISO === 'PE' ? SNS_TOPIC_ARN_PE : SNS_TOPIC_ARN_CL;

  const params = {
    TopicArn: topicArn,
    Message: JSON.stringify(appointment),
  };
  await sns.publish(params).promise();
};

export const getAppointmentsByInsuredId = async (insuredId: string): Promise<Appointment[]> => {
  const params = {
    TableName: DYNAMODB_TABLE_NAME,
    KeyConditionExpression: 'insuredId = :id',
    ExpressionAttributeValues: {
      ':id': insuredId,
    },
  };

  const result = await dynamoDb.query(params).promise();
  return (result.Items || []).map(item =>
    new Appointment(
      item.insuredId,
      item.scheduleId,
      item.countryISO,
      item.status,
    )
  );
};
