import { fail, redirect, type ActionResult } from '@sveltejs/kit';
import type { Action, Actions, PageServerLoad } from './$types';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { db } from '$lib/database';

dayjs.extend(utc);
dayjs.extend(timezone);

export const load = (async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/');
	}

	throw redirect(302, '/dashboard');
}) satisfies PageServerLoad;

const create: Action = async ({ request, locals }) => {
	const formData = await request.formData();
	const personId = locals.user?.personId;

	if (!locals.user || typeof personId !== 'string' || !personId) {
		return fail(401, { unauthorized: true });
	}

	const petId = String(formData.get('petId'));
	const foodId = String(formData.get('foodId'));
	const amount = Number(formData.get('amount'));
	const unitName = String(formData.get('unitName'));
	const date = String(formData.get('date'));
	const time = String(formData.get('time'));
	const tz = String(formData.get('tz'));

	try {
		const timestamp = dayjs.tz(`${date} ${time}`, tz).valueOf();

		const newFeeding = await db.feeding.create({
			data: {
				pet: {
					connect: {
						id: petId,
					},
				},
				person: {
					connect: {
						id: personId,
					},
				},
				food: {
					connect: {
						id: foodId,
					},
				},
				amount,
				unitName,
				timestamp: new Date(timestamp),
			},
		});

		await db.food.update({
			where: {
				id: foodId,
			},
			data: {
				amountInStock: {
					decrement: amount,
				},
			},
		});

		return <ActionResult>{ type: 'success', status: 201, feeding: newFeeding };
	} catch (e) {
		console.log(e);
		return fail(500);
	}
};

export const actions: Actions = { create };
