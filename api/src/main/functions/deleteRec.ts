import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { dynamoClient } from "../../libs/dynamoClient";
import { response } from "../utils/response";
import { z } from "zod";

const schemaNameAndDigits = z.object({
  name: z.string().min(2).max(100),
  cpf3Digits: z.string().length(3),

});

type schemaNameAndDigits = z.infer<typeof schemaNameAndDigits>;

const schemaDateAndTime = z.object({
  date: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
});

export async function handler(event: APIGatewayProxyEventV2) {
	try {
		//const data = JSON.parse(event.body ?? "{}");
		const { name, cpf3Digits } = schemaNameAndDigits.parse(event.pathParameters)
    const { date, time } = schemaDateAndTime.parse(event.queryStringParameters)
    const receivedApiKey = event.headers['x-api-key'];

    /*
      if (!receivedApiKey || receivedApiKey !== process.env.API_KEY) {
      console.warn('Forbidden: Invalid or missing API key.');
      return {
        statusCode: 403,
        body: JSON.stringify({ message: 'Forbidden' }),
      };
    } 
    */

		const command = new DeleteCommand({
			TableName: "PontosTable",
			Key: {
				PK: `${name}#${cpf3Digits}`,
				SK: `${date}#${time}`,
			},
		});

		await dynamoClient.send(command);

		return response(200, { message: "Record deleted successfully" });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return response(400, { error: 'VALIDATION_ERROR', message: error.issues.map(issue => issue.message) });
		} else {
      return response(500, { error: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' });
		}

   
	}
}
