import { db } from '$lib/database';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals, params }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const petRecord = await db.pet.findUniqueOrThrow({
		where: {
			id: params.id,
		},
		include: {
			households: {
				orderBy: {
					isPresent: 'desc',
				},
				include: {
					household: {
						select: {
							name: true,
							foods: {
								orderBy: {
									name: 'asc',
								},
								select: {
									name: true,
									amountInStock: true,
									unitName: true,
									minFractionalAmount: true,
								},
							},
						},
					},
				},
			},
		},
	});

	if (!petRecord) {
		throw error(404);
	}

	const petFeedingData = {
		name: petRecord.name,
		households: petRecord.households.map((petOnHousehold) => ({
			id: petOnHousehold.householdId,
			name: petOnHousehold.household.name,
			foods: petOnHousehold.household.foods,
		})),
	};

	return {
		pet: petFeedingData,
	};
}) satisfies PageServerLoad;
