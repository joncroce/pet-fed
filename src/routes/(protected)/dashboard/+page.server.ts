import { redirect } from '@sveltejs/kit';
import { API_KEY } from '$env/static/private';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals, fetch }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const headers = {
		headers: {
			'Authorization': `Bearer ${API_KEY}`
		}
	};
	const response = await fetch('/api/pets', headers);
	const data = response.json();

	return {
		pets: data
	};
}) satisfies PageServerLoad;