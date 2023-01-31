import { db } from '$lib/database';
import type { RequestEvent } from '@sveltejs/kit';

export const authenticateUser = async (event: RequestEvent) => {
	const { cookies } = event;

	const authToken = cookies.get('auth');

	if (typeof authToken === 'string' && authToken.length) {
		const user = await db.user.findUnique({
			where: { authToken },
			select: { username: true }
		});

		if (user) {
			return {
				name: user.username
			};
		}
	}

	return null;
};
