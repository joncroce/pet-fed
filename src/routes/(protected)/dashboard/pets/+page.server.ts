import { fail, redirect, type ActionResult } from '@sveltejs/kit';
import { db } from '$lib/database';
import type { Action, Actions, PageServerLoad } from './$types';

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
		pets
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
		const newPet = await db.pet.create({
			data: {
				name: name
			}
		});

		const newPersonsOnPets = await db.personsOnPets.create({
			data: {
				person: {
					connect: {
						id: personId
					}
				},
				pet: {
					connect: {
						id: newPet.id
					}
				}
			}
		});

		console.log(JSON.stringify(newPersonsOnPets, undefined, 2));

		return <ActionResult>{ type: 'success', status: 201, name };
	} catch (e) {
		console.log(e);
		return fail(500);
	}
};

export const actions = { createPet } satisfies Actions;
