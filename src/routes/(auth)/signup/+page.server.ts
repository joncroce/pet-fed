import type { Action, Actions, PageServerLoad } from './$types';
import bcrypt from 'bcrypt';

import { db } from '$lib/database';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(302, '/');
	}
};

const register: Action = async ({ request }) => {
	const data = await request.formData();
	const username = data.get('username');
	const password = data.get('password');

	if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) {
		return fail(400, { invalid: true });
	}

	const user = await db.user.findUnique({
		where: { username }
	});

	if (user) {
		return fail(400, { user: true, username, password });
	}

	const createdUser = await db.user.create({
		data: {
			username,
			passwordHash: await bcrypt.hash(password, 10),
			authToken: crypto.randomUUID()
		}
	});

	const createdPerson = await db.person.create({
		data: {
			displayName: createdUser.username,
			user: {
				connect: {
					id: createdUser.id
				}
			}
		}
	});

	const createdResidence = await db.residence.create({ data: {} });

	await db.personsOnResidences.create({
		data: {
			person: {
				connect: {
					id: createdPerson.id
				}
			},
			residence: {
				connect: {
					id: createdResidence.id
				}
			}
		}
	});

	throw redirect(303, '/login');
};

export const actions: Actions = { register };
