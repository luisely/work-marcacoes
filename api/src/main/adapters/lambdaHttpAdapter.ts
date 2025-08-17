import type {
	APIGatewayProxyEventV2,
	APIGatewayProxyResultV2,
} from "aws-lambda";
import type { IController } from "../../application/contracts/Controller";
import { lambdaBodyParser } from "../utils/lambdaBodyParser";

export function lambdaHttpAdapter(controller: IController<unknown>) {
	return async (
		event: APIGatewayProxyEventV2,
	): Promise<APIGatewayProxyResultV2> => {
		const body = lambdaBodyParser(event.body);
		const params = event.pathParameters ?? {};
		const queryParams = event.queryStringParameters ?? {};

		const result = await controller.handle({ body, params, queryParams });

		return {
			statusCode: result.statusCode,
			body: result.body ? JSON.stringify(result.body) : undefined,
		};
	};
}
