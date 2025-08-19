import { QueryCommand } from '@aws-sdk/lib-dynamodb'
import middy from '@middy/core'
import type { APIGatewayProxyEventV2 } from 'aws-lambda'
import { dynamoClient } from '../../libs/dynamoClient'
import { type AuthUser, authMiddleware } from '../middlewares/authMiddleware'
import { response } from '../utils/response'

export interface GetPontosResponse {
	SK: string
	PK: string
	date: string
	time: string
	name: string
}

type Marcacao = {
	SK: string
	date: string
	time: string
	[key: string]: string
}

const baseHandler = async (event: APIGatewayProxyEventV2 & { user?: AuthUser }) => {
	const command = new QueryCommand({
		TableName: 'Marcacoes',
		KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
		ExpressionAttributeValues: {
			':pk': `USER#${event.user?.sub}`,
			':sk': 'DAY#',
		},
		ScanIndexForward: false,
		Limit: 30,
	})

	const { Items } = await dynamoClient.send(command)

	if (!Items || Items.length === 0) {
		return response(404, { error: 'No registers found' })
	}

	const grouped = new Map<string, Marcacao[]>()

	for (const item of Items as Marcacao[]) {
		const [, date] = item.SK.split('#')
		if (!grouped.has(date)) grouped.set(date, [])
		grouped.get(date)!.push(item)
	}

	const pontos = Array.from(grouped.values()).flatMap((group) => group.reverse())

	//const marcacoes: GetPontosResponse[] = (Items ?? []) as GetPontosResponse[]

	return response(200, {
		pontos: pontos.map((item) => ({
			SK: item.SK,
			date: item.date,
			time: item.time,
		})),
	})
}

export const handler = middy(baseHandler).use(authMiddleware())
