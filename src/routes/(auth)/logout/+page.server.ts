import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default({ cookies }) {
		console.log(`in action to delete cookie on logout`);
		cookies.delete('auth');
		throw redirect(302, '/login');
	}
};
