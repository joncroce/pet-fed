import type { Cat } from '@prisma/client';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const response = await fetch('/api/cats');
	const cats: Cat[] = await response.json();
	return { cats };
};