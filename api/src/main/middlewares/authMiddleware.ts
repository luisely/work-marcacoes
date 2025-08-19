import type { APIGatewayProxyEventV2 } from 'aws-lambda'
import jwt from 'jsonwebtoken'
import { env } from '../../../shared/env'
import { response } from '../utils/response'

export interface AuthUser {
	sub: string
}

export const authMiddleware = () => {
	return {
		before: async (request: { event: APIGatewayProxyEventV2 }) => {
			const authHeader = request.event.headers?.authorization
			if (!authHeader) throw new Error('Unauthorized')

			const token = authHeader.replace('Bearer ', '')

			try {
				const payload = jwt.verify(token, env.JWT_SECRET) as AuthUser
				// 👇 aqui você "injeta" no event
				;(request.event as any).user = payload
			} catch {
				return response(403, { message: 'Unauthorized Access' })
			}
		},
	}
}
