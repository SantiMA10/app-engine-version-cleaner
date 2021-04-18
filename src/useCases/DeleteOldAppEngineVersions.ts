import fetch from 'node-fetch';

type Version = Record<string, string>;

export class DeleteOldAppEngineVersions {
	public async perform(options: { app: string }): Promise<void> {
		const authRequest = await fetch(
			'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token?scopes=https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/appengine.admin,https://www.googleapis.com/auth/cloud-platform.read-only',
			{ headers: { 'Metadata-Flavor': 'Google' } },
		);

		if (!authRequest.ok) {
			throw new Error(await authRequest.text());
		}

		const { access_token: token } = await authRequest.json();

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const [_, project, __, service] = options.app.split('/');

		const versionListRequest = await fetch(
			`https://appengine.googleapis.com/v1/apps/${project}/services/${service}/versions`,
			{ headers: { authorization: `Bearer ${token}` } },
		);

		if (!versionListRequest.ok) {
			throw new Error(await versionListRequest.text());
		}

		const { versions } = await versionListRequest.json();
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const [lastVersion, ...versionsReadyToDelete] = versions
			.slice()
			.sort((a: Version, b: Version) => {
				return new Date(b.createTime) > new Date(a.createTime) ? 1 : -1;
			});

		await Promise.all(
			versionsReadyToDelete.map(async (version: Version) => {
				const deleteRequest = await fetch(`https://appengine.googleapis.com/v1/${version.name}`, {
					headers: { authorization: `Bearer ${token}` },
					method: 'DELETE',
				});

				if (!deleteRequest.ok) {
					console.log(`Unable to delete ${version.name}`);
				}
			}),
		);

		return;
	}
}
