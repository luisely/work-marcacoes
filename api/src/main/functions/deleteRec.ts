import { DeleteCommand } from '@aws-sdk/lib-dynamodb'
import middy from '@middy/core'
import type { APIGatewayProxyEventV2 } from 'aws-lambda'
import { z } from 'zod'
import { dynamoClient } from '../../libs/dynamoClient'
import { type AuthUser, authMiddleware } from '../middlewares/authMiddleware'
import { response } from '../utils/response'

const schemaDateAndTime = z.object({
	date: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/),
	time: z.string().regex(/^\d{2}:\d{2}$/),
})

const baseHandler = async (event: APIGatewayProxyEventV2 & { user?: AuthUser }) => {
	try {
		const { date, time } = schemaDateAndTime.parse(event.queryStringParameters)

		const command = new DeleteCommand({
			TableName: 'Marcacoes',
			Key: {
				PK: `USER#${event.user?.sub}`,
				SK: `DAY#${date}#${time}`,
			},
		})

		await dynamoClient.send(command)

		return response(200, { message: 'Record deleted successfully' })
	} catch (error) {
		if (error instanceof z.ZodError) {
			return response(400, { error: 'VALIDATION_ERROR', message: error.issues.map((issue) => issue.message) })
		} else {
			return response(500, { error: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' })
		}
	}
}

export const handler = middy(baseHandler).use(authMiddleware())
