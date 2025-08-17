import { GetCommand, TransactWriteCommand } from '@aws-sdk/lib-dynamodb'
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import z from 'zod'
import { env } from '../../../shared/env'
import { dynamoClient } from '../../libs/dynamoClient'
import { agoraEmSegundos, TRINTA_DIAS_EM_SEGUNDOS } from '../utils/constants'
import { lambdaBodyParser } from '../utils/lambdaBodyParser'
import { response } from '../utils/response'

const singUpSchema = z.object({
	username: z.string().min(1),
	pin: z.string().min(6),
	date: z.string().min(1),
	time: z.string().min(1),
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
			return { statusCode: 400, body: JSON.stringify({ error: 'Username already exists' }) }
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
								date: new Date(date).toLocaleDateString('pt-BR'),
								time,
								type: 'horario',
								expireAt: agoraEmSegundos + TRINTA_DIAS_EM_SEGUNDOS,
							},
						},
					},
				],
			}),
		)

		const token = jwt.sign({ sub: username }, env.JWT_SECRET, { expiresIn: '12h' })

		return response(201, { message: 'ok', token })
	} catch (err) {
		if (err instanceof z.ZodError) {
			return response(400, {
				error: 'VALIDATION_ERROR',
				message: JSON.stringify(err.message),
			})
		} else {
			return response(500, { error: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' })
		}
	}
}
