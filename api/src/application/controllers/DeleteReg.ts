import type { IController } from "../contracts/Controller";

export class DeleteReg implements IController<unknown> {
	async handle( request: IController.Request	): Promise<IController.Response<unknown>> {
		const parsedBody = request.body;

		return {
			statusCode: 200,
			body: {
				parsedBody,
			},
		};
	}
}
