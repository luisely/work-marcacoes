import type { APIGatewayProxyEventV2, APIGatewayProxyEventV2WithJWTAuthorizer, APIGatewayProxyResultV2 } from 'aws-lambda'
import type { Controller } from 'src/application/contracts/Controller'
import { ZodError } from 'zod'
import { ErrorCode } from '../../application/errors/ErrorCode'
import { errorResponse } from '../utils/error-response'
import { lambdaBodyParser } from '../utils/lambdaBodyParser'

type Event = APIGatewayProxyEventV2 | APIGatewayProxyEventV2WithJWTAuthorizer

export function lambdaHttpAdapter(controller: Controller<any, unknown>) {
	return async (event: Event): Promise<APIGatewayProxyResultV2> => {
		try {
			const body = lambdaBodyParser(event.body)
			const params = event.pathParameters ?? {}
			const queryParams = event.queryStringParameters ?? {}
			const accountId = 'authorizer' in event.requestContext ? (event.requestContext.authorizer.jwt.claims.internalId as string) : null

			const response = await controller.execute({
				body,
				params,
				queryParams,
				accountId,
			})

			return {
				statusCode: response.statusCode,
				body: response.body ? JSON.stringify(response.body) : undefined,
			}
		} catch (error) {
			if (error instanceof ZodError) {
				return errorResponse({
					statusCode: 400,
					code: ErrorCode.VALIDATION,
					message: error.issues.map((issue) => ({
						field: issue.path.join('.'),
						error: issue.message,
					})),
				})
			}

			if (error instanceof HttpError) {
				return lambdaErrorResponse(error)
			}

			if (error instanceof ApplicationError) {
				return errorResponse({
					statusCode: error.statusCode ?? 400,
					code: error.code,
					message: error.message,
				})
			}

			// eslint-disable-next-line no-console
			console.log(error)

			return errorResponse({
				statusCode: 500,
				code: ErrorCode.INTERNAL_SERVER_ERROR,
				message: 'Internal server error.',
			})
		}
	}
}
