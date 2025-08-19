import { PutCommand } from '@aws-sdk/lib-dynamodb'
import middy from '@middy/core'
import type { APIGatewayProxyEventV2 } from 'aws-lambda'
import z from 'zod'
import { dynamoClient } from '../../libs/dynamoClient'
import { type AuthUser, authMiddleware } from '../middlewares/authMiddleware'
import { agoraEmSegundos, TRINTA_DIAS_EM_SEGUNDOS } from '../utils/constants'
import { lambdaBodyParser } from '../utils/lambdaBodyParser'
import { response } from '../utils/response'

const horarioSchema = z.object({
	date: z.string().regex(/^\d{4}\/\d{2}\/\d{2}$/),
	time: z.string().regex(/^\d{2}:\d{2}$/),
})

const baseHandler = async (event: APIGatewayProxyEventV2 & { user?: AuthUser }) => {
	try {
		const data = horarioSchema.parse(lambdaBodyParser(event.body))

		const command = new PutCommand({
			TableName: 'Marcacoes',
			Item: {
				PK: `USER#${event.user?.sub}`,
				SK: `DAY#${data.date}#${data.time}`,
				type: 'horario',
				name: event.user?.sub,
				date: new Date(data.date).toLocaleDateString('pt-BR'),
				time: data.time,
				expireAt: agoraEmSegundos + TRINTA_DIAS_EM_SEGUNDOS,
			},
		})

		const result = await dynamoClient.send(command)

		return response(201, result)
	} catch (error) {
		if (error) {
			return response(400, { error })
		} else {
			console.log(error)
		}
	}
}

export const handler = middy(baseHandler).use(authMiddleware())
