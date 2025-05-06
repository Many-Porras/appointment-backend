import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();

export const saveToDynamoDB = async (appointment: any): Promise<void> => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE_NAME || 'Appointments',
    Item: appointment,
  };

  await dynamoDb.put(params).promise();
};
