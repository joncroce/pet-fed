import type { Action, Actions, PageServerLoad } from './$types';
import { db } from '$lib/database';
import { fail, redirect, type ActionResult } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/');
	}

	const foods = await db.food.findMany({
		where: {
			household: {
				persons: {
					some: {
						AND: {
							residentId: {
								equals: locals.user.personId,
							},
							isManager: {
								equals: true,
							},
						},
					},
				},
			},
		},
	});

	const availableHouseholds = await db.household.findMany({
		where: {
			persons: {
				some: {
					AND: {
						residentId: {
							equals: locals.user.personId,
						},
						isManager: {
							equals: true,
						},
					},
				},
			},
		},
		select: {
			id: true,
			name: true,
		},
	});

	return {
		foods,
		availableHouseholds,
	};
}) satisfies PageServerLoad;

const create: Action = async ({ request, locals }) => {
	const formData = await request.formData();
	const personId = locals.user?.personId;

	if (typeof personId !== 'string' || !personId) {
		return fail(401, { unauthorized: true });
	}

	const householdId = formData.get('householdId');
	const name = formData.get('name');
	const amountInStock = formData.get('amountInStock');
	const unitName = formData.get('unitName');
	const minFractionalAmount = formData.get('minFractionalAmount');

	const newFoodData = Object.fromEntries(
		[
			['name', name],
			['amountInStock', amountInStock !== null ? Number(amountInStock) : null],
			['unitName', unitName],
			['minFractionalAmount', minFractionalAmount !== null ? Number(minFractionalAmount) : null],
		].filter(
			([, /* fieldName */ fieldValue]) =>
				(typeof fieldValue === 'string' && fieldValue.length) ||
				(typeof fieldValue === 'number' && fieldValue),
		),
	);

	try {
		const newFood = await db.food.create({
			data: {
				household: {
					connect: {
						id: householdId,
					},
				},
				...newFoodData,
			},
		});

		return <ActionResult>{ type: 'success', status: 201, food: newFood };
	} catch (e) {
		console.log(e);
		return fail(400, { invalid: true });
	}
};

const edit: Action = async ({ request, locals }) => {
	const formData = await request.formData();
	const personId = locals.user?.personId;

	if (typeof personId !== 'string' || !personId) {
		return fail(401, { unauthorized: true });
	}

	const id = String(formData.get('id'));
	const name = String(formData.get('name'));
	const amountInStock = Number(formData.get('amountInStock'));
	const unitName = String(formData.get('unitName'));
	const minFractionalAmount = Number(formData.get('minFractionalAmount'));

	try {
		const food = await db.food.findUniqueOrThrow({
			where: { id },
			select: {
				householdId: true,
			},
		});

		if (!food.householdId) {
			return fail(500);
		}

		const personOnHousehold = await db.personsOnHouseholds.findUniqueOrThrow({
			where: {
				residentId_householdId: {
					householdId: food.householdId,
					residentId: personId,
				},
			},
			select: {
				isManager: true,
			},
		});

		if (!personOnHousehold.isManager) {
			return fail(401, { unauthorized: true });
		}

		const updatedFood = await db.food.update({
			where: { id },
			data: {
				name,
				amountInStock,
				unitName,
				minFractionalAmount,
			},
		});

		return <ActionResult>{ type: 'success', status: 200, food: updatedFood };
	} catch (e) {
		console.log(e);
		return fail(500);
	}
};

export const actions: Actions = { create, edit };
