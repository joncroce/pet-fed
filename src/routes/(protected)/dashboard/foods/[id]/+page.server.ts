import { db } from '$lib/database';
import type { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals, params }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	let foodRecord = null;

	// Only Persons who are Managers of the Household this Food belongs to may edit it.
	try {
		foodRecord = await db.food.findFirstOrThrow({
			where: {
				AND: {
					id: {
						equals: params.id
					},
					household: {
						persons: {
							some: {
								residentId: {
									equals: locals.user.personId
								},
							}
						}
					}
				}
			},
			include: {
				household: {
					include: {
						persons: {
							where: {
								residentId: {
									equals: locals.user.personId
								}
							},
							select: {
								isManager: true
							}
						}
					}
				}
			}
		});
	} catch (e: unknown) {
		console.log(e);
		if ((e as PrismaClientKnownRequestError).code = 'P2025') {
			throw error(404);
		} else {
			throw error(500);
		}
	}

	const { name, amountInStock, minFractionalAmount, unitName, createdAt, updatedAt } = foodRecord;

	const userCanEdit = foodRecord.household?.persons[0].isManager ?? false;

	return {
		food: {
			name,
			amountInStock,
			minFractionalAmount,
			unitName,
			createdAt,
			updatedAt
		},
		userCanEdit
	};

}) satisfies PageServerLoad;