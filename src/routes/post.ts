import { Request, ResponseToolkit, ServerRoute } from '@hapi/hapi';
import { HTTP } from 'cloudevents';
import { StatusCodes } from 'http-status-codes';

import { DeleteOldAppEngineVersions } from '../useCases/DeleteOldAppEngineVersions';

export const routes = (): ServerRoute => ({
	method: 'POST',
	path: '/',
	handler: async (request: Request, h: ResponseToolkit) => {
		const event = { body: request.payload, headers: request.headers };

		if (!HTTP.isEvent(event)) {
			console.log({ event });
			return h.response().code(StatusCodes.BAD_REQUEST);
		}

		const cloudEvent = HTTP.toEvent(event);
		console.log({ cloudEvent });

		if (
			typeof cloudEvent.resourcename !== 'string' ||
			typeof cloudEvent.methodname !== 'string' ||
			cloudEvent.methodname !== 'google.appengine.v1.Versions.CreateVersion'
		) {
			return h.response({ ok: false, cloudEvent }).code(StatusCodes.OK);
		}

		await new DeleteOldAppEngineVersions().perform({ app: cloudEvent.resourcename });

		return h.response({ ok: true, cloudEvent }).code(StatusCodes.OK);
	},
});
