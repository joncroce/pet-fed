import { db } from '$lib/database';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const pets = await db.pet.findMany({
		where: {
			persons: {
				some: {
					personId: params.id
				}
			}
		},
		include: {
			feedings: true
		}
	});

	return json(pets);
};
