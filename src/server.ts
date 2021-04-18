import { Server, ServerRoute } from '@hapi/hapi';

import { allRoutes } from './routes';

export const startServer = async (routes = allRoutes()): Promise<Server> => {
	const server = await buildServer(routes);

	await server.start();
	server.log('Server running on %s', server.info.uri);

	return server;
};

export const initServer = async (routes = allRoutes()): Promise<Server> => {
	const server = await buildServer(routes);

	await server.initialize();

	return server;
};

export const buildServer = async (routes: ServerRoute[]): Promise<Server> => {
	const server = new Server({
		port: process.env.PORT || 3000,
	});

	server.route(routes);

	return server;
};
