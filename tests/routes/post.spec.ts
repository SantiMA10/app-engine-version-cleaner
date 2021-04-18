import { Headers } from '@hapi/shot';
import { CloudEvent, HTTP } from 'cloudevents';
import { StatusCodes } from 'http-status-codes';

import { initServer } from '../../src/server';
import { mockDeleteVersion, mockGetVersionList, mockMetadataServer } from '../utils/requests';

describe('POST /', () => {
	it('returns a 200 OK HTTP if the request contains an event', async () => {
		const subject = await initServer();
		mockMetadataServer();
		mockGetVersionList();
		mockDeleteVersion('v1');
		mockDeleteVersion('v2');
		const ce = new CloudEvent({
			source: '//cloudaudit.googleapis.com/projects/some-random-gcp-project/logs/activity',
			type: 'google.cloud.audit.log.v1.written',
			dataschema: 'https://d.schema.com/my.json',
			resourcename: 'apps/some-random-gcp-project/services/cleaner/versions/v3',
			methodname: 'google.appengine.v1.Versions.CreateVersion',
		});
		const message = HTTP.binary(ce);

		const { statusCode } = await subject.inject({
			method: 'POST',
			url: '/',
			headers: message.headers as Headers,
			payload: message.body as Record<string, unknown>,
		});

		expect(statusCode).toBe(StatusCodes.OK);
	});

	it('returns a 200 OK HTTP with a ok set to false if the request contains unsupported event', async () => {
		const subject = await initServer();
		const ce = new CloudEvent({
			source: '//cloudaudit.googleapis.com/projects/some-random-gcp-project/logs/activity',
			type: 'google.cloud.audit.log.v1.written',
			dataschema: 'https://d.schema.com/my.json',
			methodname: 'google.appengine.v1.Versions.UpdateVersion',
		});
		const message = HTTP.binary(ce);

		const { statusCode, result } = await subject.inject({
			method: 'POST',
			url: '/',
			headers: message.headers as Headers,
			payload: message.body as Record<string, unknown>,
		});

		expect(statusCode).toBe(StatusCodes.OK);
		expect(result).toMatchObject({ ok: false });
	});

	it('returns a 400 BAD REQUEST HTTP if the request does not contain an event', async () => {
		const subject = await initServer();

		const { statusCode } = await subject.inject({ method: 'POST', url: '/' });

		expect(statusCode).toBe(StatusCodes.BAD_REQUEST);
	});
});
