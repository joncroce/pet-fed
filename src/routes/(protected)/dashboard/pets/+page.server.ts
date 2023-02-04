import { fail, redirect, type ActionResult } from '@sveltejs/kit';
import { db } from '$lib/database';
import type { PageServerLoad } from './$types';
import type { Action, Actions } from '../$types';

export const load = (async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const personsOnPets = await db.personsOnPets.findMany({
		where: { personId: locals.user.personId },
		select: { isOwner: true, pet: { select: { id: true, name: true, feedings: true } } }
	});

	const pets = personsOnPets.map(({ isOwner, pet }) => {
		const { id, name, feedings } = pet;
		const ownedByYou = isOwner;
		return { id, name, feedings, ownedByYou };
	});

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
