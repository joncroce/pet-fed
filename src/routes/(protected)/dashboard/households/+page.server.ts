import { db } from '$lib/database';
import { fail, redirect, type ActionResult } from '@sveltejs/kit';
import type { Action, Actions, PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const householdRecords = await db.household.findMany({
		where: {
			persons: {
				some: {
					residentId: {
						equals: locals.user.personId,
					},
				},
			},
		},
		include: {
			pets: {
				select: {
					isPresent: true,
					pet: {
						select: {
							id: true,
							name: true,
						},
					},
				},
			},
			persons: {
				select: {
					isManager: true,
					isPresent: true,
					invitationAccepted: true,
					inviter: {
						select: {
							id: true,
							displayName: true,
						},
					},
					resident: {
						select: {
							id: true,
							displayName: true,
						},
					},
				},
			},
			foods: {
				select: {
					id: true,
					name: true,
					amountInStock: true,
					unitName: true,
					minFractionalAmount: true,
				},
			},
		},
	});

	return {
		households: householdRecords.map((household) => ({
			id: household.id,
			name: household.name,
			youAreManager:
				household.persons.findIndex(
					(person) => person.resident.id === locals.user?.personId && person.isManager,
				) !== -1,
			pets: household.pets.map((pet) => ({
				...pet.pet,
				isPresent: pet.isPresent,
			})),
			persons: household.persons.map((person) => ({
				...person.resident,
				isManager: person.isManager,
				isPresent: person.isPresent,
				invitedBy: person.inviter?.displayName ?? null,
				invitationAccepted: person.invitationAccepted,
			})),
			foods: household.foods,
		})),
	};
}) satisfies PageServerLoad;

const edit: Action = async ({ request, locals }) => {
	const formData = await request.formData();
	const personId = locals.user?.personId;

	if (typeof personId !== 'string' || !personId) {
		return fail(401, { unauthorized: true });
	}

	const id = String(formData.get('id') ?? '');
	const name = String(formData.get('name') ?? '');

	try {
		const personOnHousehold = await db.personsOnHouseholds.findUniqueOrThrow({
			where: {
				residentId_householdId: {
					householdId: id,
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

		const updatedHousehold = await db.household.update({
			where: {
				id,
			},
			data: {
				name,
			},
		});

		return <ActionResult>{ type: 'success', status: 200, household: updatedHousehold };
	} catch (e) {
		console.log(e);
		return fail(500);
	}
};

export const actions: Actions = { edit };
