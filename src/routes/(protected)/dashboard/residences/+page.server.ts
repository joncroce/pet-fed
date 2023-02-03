import { redirect } from '@sveltejs/kit';
import { db } from '$lib/database';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const personsOnResidences = await db.personsOnResidences.findMany({
		where: { personId: locals.user.personId },
		select: {
			isManager: true,
			residence: {
				select: {
					id: true,
					name: true,
					foods: true,
					personsAt: true,
					petsAt: true
				}
			}
		}
	});

	const residences = personsOnResidences.map(({ isManager, residence }) => {
		const { id, name, foods, personsAt, petsAt } = residence;
		const managedByYou = isManager;
		return {
			id,
			name,
			foodsCount: foods.length,
			personsCount: personsAt.length,
			petsCount: petsAt.length,
			managedByYou
		};
	});

	return {
		personId: locals.user.personId,
		residences: residences
	};
}) satisfies PageServerLoad;
