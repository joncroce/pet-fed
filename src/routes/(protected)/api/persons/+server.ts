import { db } from '$lib/database';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const persons = await db.person.findMany();

	return json(persons);
};
