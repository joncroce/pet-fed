import { error, fail, redirect, type ActionResult } from '@sveltejs/kit';
import { db } from '$lib/database';
import type { Action, Actions, PageServerLoad } from './$types';

export const load = (async ({ locals, params }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const petRecord = await db.pet.findUniqueOrThrow({
		where: {
			id: params.id
		},
		include: {
			feedings: {
				orderBy: {
					time: 'desc'
				},
				take: 5,
				include: {
					food: true,
					household: true,
					person: true
				}
			},
			households: {
				orderBy: {
					isPresent: 'desc'
				},
				include: {
					household: {
						select: {
							name: true
						}
					}
				}
			},
			persons: {
				orderBy: {
					isOwner: 'desc'
				},
				include: {
					person: {
						select: {
							id: true,
							displayName: true
						}
					}
				}
			}
		}
	});

	if (!petRecord) {
		throw error(404);
	}

	const petData = {
		name: petRecord.name,
		feedings: petRecord.feedings,
		households: petRecord.households.map((petOnHousehold) => ({
			name: petOnHousehold.household.name,
			isPresent: petOnHousehold.isPresent
		})),
		persons: petRecord.persons.map((personOnPet) => ({
			id: personOnPet.personId,
			name: personOnPet.person.displayName,
			isOwner: personOnPet.isOwner
		}))
	};

	const youAreOwner =
		petRecord.persons.findIndex(({ personId }) => personId === locals.user?.personId) !== -1;

	return {
		pet: petData,
		youAreOwner
	};
}) satisfies PageServerLoad;

const deletePet: Action = async ({ params, locals }) => {
	const petId = params.id;
	const personId = locals.user?.personId;

	if (typeof personId !== 'string' || typeof petId !== 'string' || !personId || !petId) {
		return fail(400);
	}

	try {
		await db.personsOnPets.delete({
			where: { petId_personId: { personId: personId, petId: petId } }
		});

		await db.pet.delete({
			where: { id: petId }
		});

		return <ActionResult>{ type: 'success', status: 204 };
	} catch (e) {
		console.log(e);
		return fail(500);
	}
};

export const actions: Actions = { deletePet };
