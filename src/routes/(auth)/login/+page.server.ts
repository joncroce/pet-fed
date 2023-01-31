import { db } from '$lib/database';
import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import type { Action, Actions, PageServerLoad } from './$types';


export const load = (async ({ locals }) => {
	if (locals.user) {
		throw redirect(302, '/dashboard');
	}
}) satisfies PageServerLoad;

const login: Action = async ({ cookies, request }) => {
	const data = await request.formData();
	const username = data.get('username');
	const password = data.get('password');

	if (
		typeof username !== 'string' ||
		typeof password !== 'string' ||
		!username ||
		!password
	) {
		return fail(400, { invalid: true });
	}

	const user = await db.user.findUnique({ where: { username } });

	if (!user) {
		return fail(400, { credentials: true });
	}

	const userPassword = await bcrypt.compare(password, user.passwordHash);

	if (!userPassword) {
		return fail(400, { credentials: true });
	}

	const authenticatedUser = await db.user.update({
		where: { username: user.username },
		data: { authToken: crypto.randomUUID() },
	});

	cookies.set('auth', authenticatedUser.authToken, {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		secure: process.env.NODE_ENV === 'production',
		maxAge: 60 * 60 * 24 * 7, // One week
	});

	throw redirect(302, '/dashboard');
};

export const actions: Actions = { login };