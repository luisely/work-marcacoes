import { GetCommand } from '@aws-sdk/lib-dynamodb'
import type { APIGatewayProxyEventV2 } from 'aws-lambda'
import { compare } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import z from 'zod'
import { env } from '../../../shared/env'
import { dynamoClient } from '../../libs/dynamoClient'
import { lambdaBodyParser } from '../utils/lambdaBodyParser'
import { response } from '../utils/response'

const singUpSchema = z.object({
	name: z.string(),
	pin: z.string(),
})

export async function handler(event: APIGatewayProxyEventV2) {
	const { name, pin } = singUpSchema.parse(lambdaBodyParser(event.body))

	const command = new GetCommand({
		TableName: 'Marcacoes',
		Key: {
			PK: `USER#${name}`,
			SK: 'PROFILE',
		},
	})

	const { Item: user } = await dynamoClient.send(command)

	if (!user) {
		return response(401, { message: 'Usuário não encontrado' })
	}

	const senhaCorreta = await compare(pin, user.pin)

	if (!senhaCorreta) {
		return response(401)
	}

	const token = jwt.sign(
		{
			sub: user.username, // subject
		},
		env.JWT_SECRET,
		{ expiresIn: '8h' }, // expira em 8 horas
	)

	return { token }
}
