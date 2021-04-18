import { ServerRoute } from '@hapi/hapi';

import { routes as get } from './post';

export const allRoutes = (): ServerRoute[] => [get()];
