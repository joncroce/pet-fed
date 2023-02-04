import type { Action, Actions, PageServerLoad } from './$types';
import bcrypt from 'bcrypt';

import { db } from '$lib/database';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(302, '/');
	}
};

const register: Action = async ({ request, cookies }) => {
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

	await db.person.create({
		data: {
			displayName: createdUser.username,
			user: {
				connect: {
					id: createdUser.id
				}
			}
		}
	});

	cookies.set('auth', createdUser.authToken, {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		secure: process.env.NODE_ENV === 'production',
		maxAge: 60 * 60 * 24 * 7 // One week
	});

	throw redirect(303, '/dashboard');
};

export const actions: Actions = { register };
