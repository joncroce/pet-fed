<script lang="ts">
	import '../dashboard.postcss';
	import Icon from '@iconify/svelte';
	import EditHouseholdForm from '$lib/components/EditHouseholdForm.svelte';
	import CreateFeedingForm from '$lib/components/CreateFeedingForm.svelte';
	import CreateFoodForm from '$lib/components/CreateFoodForm.svelte';
	import EditFoodForm from '$lib/components/EditFoodForm.svelte';
	import Modal, { bind } from 'svelte-simple-modal';
	import type { Component } from 'svelte-simple-modal/types/Modal.svelte';
	import type { ComponentProps } from 'svelte';
	import type { Feeding, Food, Household, Pet } from '@prisma/client';
	import { writable, type Writable } from 'svelte/store';
	import type { PageData } from './$types';

	const modal: Writable<Component | null> = writable(null);
	const closeModal = () => modal.set(null);

	const showCreateFoodModal = (householdId: string) =>
		modal.set(
			bind(CreateFoodForm, {
				form: { householdId },
				actionType: 'create',
				disableHouseholdSelect: true,
				availableHouseholds: [],
				successCallback: () => {
					console.log('Successfully created food.');
					closeModal();
				},
				cancel: closeModal,
			} as ComponentProps<CreateFoodForm>),
		);

	const showEditFoodModal = (food: Partial<Food>) =>
		modal.set(
			bind(EditFoodForm, {
				form: { ...food },
				food,
				successCallback: () => {
					console.log('Successfully updated food.');
					closeModal();
				},
				cancel: closeModal,
			} as ComponentProps<EditFoodForm>),
		);

	const showEditHouseholdModal = (household: Partial<Household>) => {
		return modal.set(
			bind(EditHouseholdForm, {
				form: { ...household },
				household,
				successCallback: () => {
					console.log('Successfully updated household.');
					closeModal();
				},
				cancel: closeModal,
			} as ComponentProps<EditHouseholdForm>),
		);
	};

	const showCreateFeedingForm = (
		feeding: Partial<Feeding>,
		householdData: { pets: Partial<Pet>[]; foods: Partial<Food>[] },
	) => {
		const initialData = {
			foodId: householdData.foods.length ? householdData.foods[0].id : null,
			petId: householdData.pets.length ? householdData.pets[0].id : null,
			timestamp: Date.now(),
			...feeding,
		};
		return modal.set(
			bind(CreateFeedingForm, {
				form: initialData,
				feeding: initialData,
				availablePets: householdData.pets,
				availableFoods: householdData.foods,
				successCallback: () => {
					console.log('Successfully created feeding.');
					closeModal();
				},
				cancel: closeModal,
			} as ComponentProps<CreateFeedingForm>),
		);
	};

	export let data: PageData;
</script>

<Modal show={$modal}>
	<main>
		<h2>Households</h2>
		{#each data.households as household}
			<article class="household">
				<div class="household_header">
					<h3 class="household_header_name">
						{household.name}
						{#if household.youAreManager}
							<span class="household_header_name_role">
								<Icon icon="material-symbols:star" />
								Manager
								<Icon icon="material-symbols:star" />
							</span>
						{/if}
					</h3>
					<button
						class="button with-icon"
						type="button"
						data-form-action="edit"
						on:click={() => showEditHouseholdModal(household)}
						><Icon icon="material-symbols:edit" />Edit</button
					>
				</div>
				<hr />
				<section data-household-subgroup="pets">
					<div class="household_subgroup_header">
						<h4 class="household_subgroup_header_name">
							Pets <span class="household_subgroup_header_count">({household.pets.length})</span>
						</h4>
						<div class="buttonset">
							<button class="button" type="button" data-form-action="move">Bring Pet</button>
							<button class="button" type="button" data-form-action="create">Create Pet</button>
						</div>
					</div>
					<table>
						<thead>
							<tr>
								<th>Name</th>
								<th>Is Present</th>
							</tr>
						</thead>
						<tbody>
							{#each household.pets as pet}
								<tr>
									<td><strong>{pet.name}</strong></td>
									<td>
										{#if pet.isPresent}
											<div class="icon-wrapper">
												<Icon icon="material-symbols:check-box" />
											</div>
										{/if}
									</td>
									<td>
										<button
											class="button with-icon"
											type="button"
											data-form-action="create"
											on:click={() =>
												showCreateFeedingForm(
													{ petId: pet.id },
													{ pets: household.pets, foods: household.foods },
												)}
										>
											<Icon icon="mdi:bowl" />
											Feed
										</button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</section>
				<section data-household-subgroup="persons">
					<div class="household_subgroup_header">
						<h4 class="household_subgroup_header_name">
							Persons <span class="household_subgroup_header_count"
								>({household.persons.length})</span
							>
						</h4>
						<button class="button" type="button" data-form-action="invite">Invite Person</button>
					</div>
					<table>
						<thead>
							<tr>
								<th>Name</th>
								<th>Is Present</th>
								<th>Is Manager</th>
								<th>Invited By</th>
								<th>Invite Status</th>
							</tr>
						</thead>
						<tbody>
							{#each household.persons as person}
								<tr>
									<td><strong>{person.displayName}</strong></td>
									<td>
										{#if person.isPresent}
											<div class="icon-wrapper">
												<Icon icon="material-symbols:check-box" />
											</div>
										{/if}
									</td>
									<td>
										{#if person.isManager}
											<div class="icon-wrapper">
												<Icon icon="material-symbols:check-box" />
											</div>
										{/if}
									</td>
									<td>{person.invitedBy ?? '—'}</td>
									<td>
										{person.invitationAccepted === true
											? 'Yes'
											: person.invitationAccepted === false
											? 'No'
											: '—'}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</section>
				<section data-household-subgroup="foods">
					<div class="household_subgroup_header">
						<h4 class="household_subgroup_header_name">
							Foods <span class="household_subgroup_header_count">({household.foods.length})</span>
						</h4>
						<button
							class="button"
							type="button"
							data-form-action="create"
							on:click={() => showCreateFoodModal(household.id)}>Create Food</button
						>
					</div>
					<table>
						<thead>
							<tr>
								<th>Name</th>
								<th>Qty in Stock</th>
							</tr>
						</thead>
						<tbody>
							{#each household.foods as food}
								<tr>
									<td><strong>{food.name}</strong></td>
									<td>{food.amountInStock} {food.unitName}</td>
									<td
										><button
											class="button with-icon"
											type="button"
											data-form-action="edit"
											on:click={() => showEditFoodModal(food)}
											><Icon icon="material-symbols:edit-document" />Edit</button
										></td
									>
								</tr>
							{/each}
						</tbody>
					</table>
				</section>
			</article>
		{/each}
	</main>
</Modal>

<style lang="postcss">
	.household {
		padding: 1rem 2rem;
		border: 2px solid var(--color-chocolate-dark);
		border-radius: 1rem;
		background-color: var(--color-bone);

		&_header {
			display: flex;
			justify-content: space-between;
			align-items: baseline;

			&_name {
				display: flex;
				justify-content: flex-start;
				align-items: top;
				font-size: 2.4rem;
				gap: 0.25em;

				&_role {
					display: flex;
					align-items: center;
					font-family: 'Gantari', sans-serif;
					font-size: 0.5em;
					color: var(--color-tan-dark);
				}
			}

			button {
				font-size: 1em;
			}
		}

		&_subgroup {
			&_header {
				display: flex;
				justify-content: space-between;
				align-items: baseline;

				&_name {
					margin-block: 0.5rem;
					font-size: 1.8rem;
				}

				.button {
					font-size: 1.2rem;
				}
			}
		}

		section {
			margin-block: 2rem;
		}
	}

	td:has(button) {
		button {
			font-size: 0.9em;
		}
	}

	.buttonset {
		display: flex;
		gap: 1em;
	}

	button.with-icon {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.25em;
	}
</style>
