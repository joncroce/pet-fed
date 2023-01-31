import { json, type Handle } from '@sveltejs/kit';
import { authenticateUser } from '$lib/server/auth';
import { API_KEY } from '$env/static/private';

export const handle: Handle = (async ({ event, resolve }) => {
	event.locals.user = await authenticateUser(event);

	if (event.url.pathname.startsWith('/api')) {
		const authorization = event.request.headers.get('Authorization');
		if (!authorization || !authorization.startsWith('Bearer ') || authorization.slice(7) !== API_KEY) {
			return json({ error: 'Unauthorized Request' }, { status: 401 });
		}
	}

	const response = await resolve(event);
	return response;
}) satisfies Handle;