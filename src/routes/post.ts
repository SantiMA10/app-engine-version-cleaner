import { Request, ResponseToolkit, ServerRoute } from '@hapi/hapi';
import { HTTP } from 'cloudevents';
import { StatusCodes } from 'http-status-codes';

export const routes = (): ServerRoute => ({
	method: 'POST',
	path: '/',
	handler: (request: Request, h: ResponseToolkit) => {
		const event = { body: request.payload, headers: request.headers };

		if (!HTTP.isEvent(event)) {
			console.log({ event });
			return h.response().code(StatusCodes.BAD_REQUEST);
		}

		const cloudEvent = HTTP.toEvent(event);
		console.log({ cloudEvent });
		return h.response({ ok: true, cloudEvent }).code(StatusCodes.OK);
	},
});
