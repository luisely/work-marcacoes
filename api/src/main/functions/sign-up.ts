import { GetCommand, TransactWriteCommand } from '@aws-sdk/lib-dynamodb'
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import z from 'zod'
import { env } from '../../../shared/env'
import { ErrorCode } from '../../application/errors/ErrorCode'
import { dynamoClient } from '../../libs/dynamoClient'
import { agoraEmSegundos, TRINTA_DIAS_EM_SEGUNDOS } from '../utils/constants'
import { errorResponse } from '../utils/error-response'
import { lambdaBodyParser } from '../utils/lambdaBodyParser'
import { response } from '../utils/response'

const singUpSchema = z.object({
	username: z.string().min(1),
	pin: z.string().min(6),
	date: z.string().regex(/^\d{4}\/\d{2}\/\d{2}$/),
	time: z.string().regex(/^\d{2}:\d{2}$/),
})

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
	try {
		const { username, pin, date, time } = singUpSchema.parse(lambdaBodyParser(event.body))

		const command = new GetCommand({
			TableName: env.TABLE_NAME,
			Key: {
				PK: `USER#${username}`,
				SK: 'PROFILE',
			},
		})

		const result = await dynamoClient.send(command)

		if (result.Item) {
			return response(400, { error: 'Username already exists' })
		}

		const hashedPin = await bcrypt.hash(pin, 10)

		await dynamoClient.send(
			new TransactWriteCommand({
				TransactItems: [
					{
						Put: {
							TableName: env.TABLE_NAME,
							Item: {
								PK: `USER#${username}`,
								SK: 'PROFILE',
								username,
								pin: hashedPin,
								createdAt: new Date().toISOString(),
							},
							ConditionExpression: 'attribute_not_exists(PK)',
						},
					},
					{
						Put: {
							TableName: env.TABLE_NAME,
							Item: {
								PK: `USER#${username}`,
								SK: `DAY#${date}#${time}`,
								type: 'horario',
								name: username,
								date: new Date(date).toLocaleDateString('pt-BR'),
								time,
								expireAt: agoraEmSegundos + TRINTA_DIAS_EM_SEGUNDOS,
							},
						},
					},
				],
			}),
		)

		const token = jwt.sign({ sub: username }, env.JWT_SECRET, { expiresIn: '12h' })

		return response(201, { message: 'ok', token })
	} catch (error) {
		if (error instanceof z.ZodError) {
			return errorResponse({
				statusCode: 400,
				code: ErrorCode.VALIDATION,
				message: error.issues.map((issue) => ({
					field: issue.path.join('.'),
					error: issue.message,
				})),
			})
		} else {
			return response(500, { error: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' })
		}
	}
}
