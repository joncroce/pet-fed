import { db } from '$lib/database';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const householdRecords = await db.household.findMany({
		where: {
			persons: {
				some: {
					residentId: {
						equals: locals.user.personId
					}
				}
			}
		},
		include: {
			pets: {
				select: {
					isPresent: true,
					pet: {
						select: {
							id: true,
							name: true
						}
					}
				}
			},
			persons: {
				select: {
					isManager: true,
					isPresent: true,
					invitationAccepted: true,
					inviter: {
						select: {
							id: true,
							displayName: true
						}
					},
					resident: {
						select: {
							id: true,
							displayName: true
						}
					}
				}
			},
			foods: {
				select: {
					id: true,
					name: true,
					amountInStock: true,
					unitName: true
				}
			},
		},
	});

	return {
		households: householdRecords.map((household) => ({
			id: household.id,
			name: household.name,
			youAreManager: household.persons.findIndex(
				(person) =>
					person.resident.id === locals.user?.personId && person.isManager) !== -1,
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
			foods: household.foods
		}))
	};

}) satisfies PageServerLoad;