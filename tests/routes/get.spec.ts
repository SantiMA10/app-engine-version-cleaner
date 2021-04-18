import { StatusCodes } from 'http-status-codes';

import { initServer } from '../../src/server';

describe('GET /', () => {
	it('returns a 200 OK HTTP status code', async () => {
		const subject = await initServer();

		const { statusCode } = await subject.inject({ method: 'GET', url: '/' });

		expect(statusCode).toBe(StatusCodes.OK);
	});
});
