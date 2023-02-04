import type { Action, Actions, PageServerLoad } from './$types';
import { db } from '$lib/database';
import { fail, redirect, type ActionResult } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/');
	}

	const foods = await db.food.findMany({
		where: { person: { id: locals.user.personId } }
	});

	return {
		foods
	};
}) satisfies PageServerLoad;

const create: Action = async ({ request, locals }) => {
	const formData = await request.formData();
	const personId = locals.user?.personId;

	if (typeof personId !== 'string' || !personId) {
		return fail(401, { unauthorized: true });
	}

	const name = formData.get('name');
	const amountInStock = formData.get('amountInStock');
	const unitName = formData.get('unitName');
	const minFractionalAmount = formData.get('minFractionalAmount');

	const newFoodData = Object.fromEntries(
		[
			['name', name],
			['amountInStock', amountInStock !== null ? Number(amountInStock) : null],
			['unitName', unitName],
			['minFractionalAmount', minFractionalAmount !== null ? Number(minFractionalAmount) : null]
		].filter(
			([, /* fieldName */ fieldValue]) =>
				(typeof fieldValue === 'string' && fieldValue.length) ||
				(typeof fieldValue === 'number' && fieldValue)
		)
	);

	console.log(JSON.stringify(newFoodData, undefined, 2));

	try {
		const newFood = await db.food.create({
			data: {
				person: {
					connect: {
						id: personId
					}
				},
				...newFoodData
			}
		});

		return <ActionResult>{ type: 'success', status: 201, newFood };
	} catch (e) {
		console.log(e);
		return fail(400, { invalid: true });
	}
};

export const actions: Actions = { create };
