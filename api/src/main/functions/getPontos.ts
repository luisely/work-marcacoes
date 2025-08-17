import { QueryCommand } from '@aws-sdk/lib-dynamodb'
import type { APIGatewayProxyEventV2 } from 'aws-lambda'
import { dynamoClient } from '../../libs/dynamoClient'
import { response } from '../utils/response'

export async function handler(event: APIGatewayProxyEventV2) {
	const { name } = event.pathParameters || {}

	const command = new QueryCommand({
		TableName: 'Marcacoes',
		KeyConditionExpression: 'PK = #pk AND begins_with(SK, #sk)',
		ExpressionAttributeValues: {
			'#pk': `USER#${name}`,
			'#sk': `DAY#`,
		},
		ScanIndexForward: true,
		Limit: 30,
	})

	const { Items } = await dynamoClient.send(command)

	if (!Items || Items.length === 0) {
		return response(404, { error: 'No registers found' })
	}

	return response(200, { pontos: Items.map((item) => item) })
}
