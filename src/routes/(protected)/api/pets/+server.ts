import { db } from '$lib/database';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const pets = await db.pet.findMany();

	return json(pets);
};
