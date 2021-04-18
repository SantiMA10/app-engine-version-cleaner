import { Headers } from '@hapi/shot';
import { CloudEvent, HTTP } from 'cloudevents';
import { StatusCodes } from 'http-status-codes';

import { initServer } from '../../src/server';

describe('GET /', () => {
	it('returns a 200 OK HTTP if the request contains an event', async () => {
		const subject = await initServer();
		const ce = new CloudEvent({
			source: '/source',
			type: 'type',
			datacontenttype: 'text/plain',
			dataschema: 'https://d.schema.com/my.json',
			subject: 'cha.json',
			data: 'my-data',
			extension1: 'some extension data',
		});
		const message = HTTP.binary(ce);

		const { statusCode } = await subject.inject({
			method: 'GET',
			url: '/',
			headers: message.headers as Headers,
			payload: message.body as Record<string, unknown>,
		});

		expect(statusCode).toBe(StatusCodes.OK);
	});

	it('returns a 400 BAD REQUEST HTTP if the request does not contain an event', async () => {
		const subject = await initServer();

		const { statusCode } = await subject.inject({ method: 'GET', url: '/' });

		expect(statusCode).toBe(StatusCodes.BAD_REQUEST);
	});
});
