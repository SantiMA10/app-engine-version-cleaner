import nock from 'nock';

import { DeleteOldAppEngineVersions } from '../../src/useCases/DeleteOldAppEngineVersions';
import {
	mockDeleteVersion,
	mockFailDeleteVersion,
	mockFailGetVersionList,
	mockFailMetadataServer,
	mockGetVersionList,
	mockMetadataServer,
} from '../utils/requests';

describe('DeleteOldAppEngineVersions', () => {
	beforeEach(() => {
		nock.cleanAll();
	});

	it('calls the metadata server to get the access token', async () => {
		const request = mockMetadataServer();
		mockGetVersionList();
		mockDeleteVersion('v1');
		mockDeleteVersion('v2');
		const subject = new DeleteOldAppEngineVersions();

		await subject.perform({
			app: 'apps/some-random-gcp-project/services/cleaner/versions/v3',
		});

		expect(request.isDone()).toBeTruthy();
	});

	it('throws an error if the metadata server fails', async () => {
		mockFailMetadataServer();
		const subject = new DeleteOldAppEngineVersions();

		await expect(
			subject.perform({
				app: 'apps/some-random-gcp-project/services/cleaner/versions/v3',
			}),
		).rejects.toThrow();
	});

	it('calls the AppEngine api to get the list of versions', async () => {
		mockMetadataServer();
		const request = mockGetVersionList();
		mockDeleteVersion('v1');
		mockDeleteVersion('v2');
		const subject = new DeleteOldAppEngineVersions();

		await subject.perform({
			app: 'apps/some-random-gcp-project/services/cleaner/versions/v3',
		});

		expect(request.isDone()).toBeTruthy();
	});

	it('throws an error if the AppEngine api fails while getting the list', async () => {
		mockMetadataServer();
		mockFailGetVersionList();
		const subject = new DeleteOldAppEngineVersions();

		await expect(
			subject.perform({
				app: 'apps/some-random-gcp-project/services/cleaner/versions/v3',
			}),
		).rejects.toThrow();
	});

	it('calls the AppEngine api to delete the older versions', async () => {
		mockMetadataServer();
		mockGetVersionList();
		const requestV1 = mockDeleteVersion('v1');
		const requestV2 = mockDeleteVersion('v2');
		const subject = new DeleteOldAppEngineVersions();

		await subject.perform({
			app: 'apps/some-random-gcp-project/services/cleaner/versions/v3',
		});

		expect(requestV1.isDone()).toBeTruthy();
		expect(requestV2.isDone()).toBeTruthy();
	});

	it('does not throw anything if anything fails deleting app engine versions', async () => {
		mockMetadataServer();
		mockGetVersionList();
		mockFailDeleteVersion('v1');
		mockFailDeleteVersion('v2');
		const subject = new DeleteOldAppEngineVersions();

		await expect(
			subject.perform({
				app: 'apps/some-random-gcp-project/services/cleaner/versions/v3',
			}),
		).resolves.toBeFalsy();
	});
});
