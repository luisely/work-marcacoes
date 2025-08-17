import { PutCommand } from '@aws-sdk/lib-dynamodb'
import type { APIGatewayProxyEventV2 } from 'aws-lambda'
import { dynamoClient } from '../../libs/dynamoClient'
import { lambdaBodyParser } from '../utils/lambdaBodyParser'
import { response } from '../utils/response'

export async function handler(event: APIGatewayProxyEventV2) {
	try {
		const TRINTA_DIAS_EM_SEGUNDOS = 30 * 24 * 60 * 60
		const agoraEmSegundos = Math.floor(Date.now() / 1000)

		const data = lambdaBodyParser(event.body)

		const command = new PutCommand({
			TableName: 'Marcacoes',
			Item: {
				PK: `USER#${data.name}`,
				SK: `DAY#${data.date}#${data.time}`,
				type: 'horario',
				name: data.name,
				date: data.date,
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
