import db from '$lib/database';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {

	const cats = await db.cat.findMany();

	return json(cats);
};