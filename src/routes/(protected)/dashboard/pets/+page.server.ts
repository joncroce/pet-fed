import { fail, redirect, type ActionResult } from '@sveltejs/kit';
import { db } from '$lib/database';
import type { PageServerLoad } from './$types';
import type { Action, Actions } from '../$types';
// import { API_KEY } from '$env/static/private';

export const load = (async ({ locals /* fetch */ }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	// const user = await db.user.findUnique({
	// 	where: {
	// 		username: locals.user.name
	// 	},
	// 	include: {
	// 		person: {
	// 			select: {
	// 				id: true,
	// 				displayName: true,
	// 				pets: {
	// 					include: {
	// 						pet: true,
	// 					}
	// 				}
	// 			}
	// 		}
	// 	}
	// });

	// const response = await fetch(`/api/persons/${locals.user.personId}/pets`, {
	// 	headers: {
	// 		Authorization: `Bearer ${API_KEY}`
	// 	}
	// });

	// const data = response.json();

	const personsOnPets = await db.personsOnPets.findMany({
		where: { personId: locals.user.personId },
		select: { isOwner: true, pet: { select: { id: true, name: true, feedings: true } } }
	});

	const pets = personsOnPets.map(({ isOwner, pet }) => {
		const { id, name, feedings } = pet;
		const ownedByYou = isOwner;
		return { id, name, feedings, ownedByYou };
	});

	console.log(pets);

	return {
		personId: locals.user.personId,
		pets: pets
	};
}) satisfies PageServerLoad;

const createPet: Action = async ({ request, locals }) => {
	const data = await request.formData();
	const name = data.get('name');
	const personId = locals.user?.personId;

	if (typeof name !== 'string' || typeof personId !== 'string' || !name || !personId) {
		return fail(400);
	}

	try {
		await db.person.update({
			select: {
				id: true
			},
			where: {
				id: personId
			},
			data: {
				pets: {
					create: {
						pet: {
							create: {
								name: name
							}
						}
					}
				}
			}
		});

		return <ActionResult>{ type: 'success', status: 201, name };
	} catch (e) {
		console.log(e);
		return fail(500);
	}
};

export const actions: Actions = { createPet };
