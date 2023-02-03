import { db } from '$lib/database';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const person = await db.person.findUniqueOrThrow({
		where: { id: params.id }
	});

	return json(person);
};
