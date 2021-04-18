import nock from 'nock';

export const mockMetadataServer = (): nock.Scope => {
	return nock('http://metadata.google.internal', {
		reqheaders: { 'Metadata-Flavor': 'Google' },
	})
		.get(
			'/computeMetadata/v1/instance/service-accounts/default/token?scopes=https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/appengine.admin,https://www.googleapis.com/auth/cloud-platform.read-only',
		)
		.reply(200, {
			access_token: 'ya29.AHES6ZRN3-HlhAPya30GnW_bHSb_QtAS08i85nHq39HE3C2LTrCARA',
			expires_in: 3599,
			token_type: 'Bearer',
		});
};

export const mockFailMetadataServer = (): nock.Scope => {
	return nock('http://metadata.google.internal')
		.get(
			'/computeMetadata/v1/instance/service-accounts/default/token?scopes=https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/appengine.admin,https://www.googleapis.com/auth/cloud-platform.read-only',
		)
		.reply(500, 'Boom!');
};

export const mockGetVersionList = (): nock.Scope => {
	return nock('https://appengine.googleapis.com', {
		reqheaders: {
			authorization: 'Bearer ya29.AHES6ZRN3-HlhAPya30GnW_bHSb_QtAS08i85nHq39HE3C2LTrCARA',
		},
	})
		.get('/v1/apps/some-random-gcp-project/services/cleaner/versions')
		.reply(200, {
			versions: [
				{
					name: 'apps/some-random-gcp-project/services/cleaner/versions/v1',
					id: 'v1',
					automaticScaling: {
						standardSchedulerSettings: {
							maxInstances: 1,
						},
					},
					instanceClass: 'F1',
					network: {},
					runtime: 'nodejs14',
					threadsafe: true,
					env: 'standard',
					servingStatus: 'SERVING',
					createdBy: 'someone@example.com',
					createTime: '2021-04-18T15:47:53Z',
					diskUsageBytes: '7517896',
					versionUrl: 'https://v1-dot-cleaner-dot-some-random-gcp-project.appspot.com',
					runtimeChannel: 'default',
				},
				{
					name: 'apps/some-random-gcp-project/services/cleaner/versions/v2',
					id: 'v2',
					automaticScaling: {
						standardSchedulerSettings: {
							maxInstances: 1,
						},
					},
					instanceClass: 'F1',
					network: {},
					runtime: 'nodejs14',
					threadsafe: true,
					env: 'standard',
					servingStatus: 'SERVING',
					createdBy: 'someone@example.com',
					createTime: '2021-04-18T16:03:12Z',
					diskUsageBytes: '7517896',
					versionUrl: 'https://v2-dot-cleaner-dot-some-random-gcp-project.appspot.com',
					runtimeChannel: 'default',
				},
				{
					name: 'apps/some-random-gcp-project/services/cleaner/versions/v3',
					id: 'v3',
					automaticScaling: {
						standardSchedulerSettings: {
							maxInstances: 1,
						},
					},
					instanceClass: 'F1',
					network: {},
					runtime: 'nodejs14',
					threadsafe: true,
					env: 'standard',
					servingStatus: 'SERVING',
					createdBy: 'someone@example.com',
					createTime: '2021-04-18T16:17:55Z',
					diskUsageBytes: '7517936',
					versionUrl: 'https://v3-dot-cleaner-dot-some-random-gcp-project.appspot.com',
					runtimeChannel: 'default',
				},
			],
		});
};

export const mockFailGetVersionList = (): nock.Scope => {
	return nock('https://appengine.googleapis.com')
		.get('/v1/apps/some-random-gcp-project/services/cleaner/versions')
		.reply(500, 'Boom!');
};

export const mockDeleteVersion = (version: string): nock.Scope => {
	return nock('https://appengine.googleapis.com', {
		reqheaders: {
			authorization: 'Bearer ya29.AHES6ZRN3-HlhAPya30GnW_bHSb_QtAS08i85nHq39HE3C2LTrCARA',
		},
	})
		.delete(`/v1/apps/some-random-gcp-project/services/cleaner/versions/${version}`)
		.reply(200);
};

export const mockFailDeleteVersion = (version: string): nock.Scope => {
	return nock('https://appengine.googleapis.com')
		.delete(`/v1/apps/some-random-gcp-project/services/cleaner/versions/${version}`)
		.reply(500, 'Boom!');
};
