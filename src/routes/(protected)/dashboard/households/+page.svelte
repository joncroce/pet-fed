<script lang="ts">
	import '../dashboard.postcss';
	import type { PageData } from './$types';
	import Icon from '@iconify/svelte';
	import CreateFoodForm from '$lib/components/CreateFoodForm.svelte';

	export let data: PageData;

	type Subgroup = 'pets' | 'persons' | 'foods';

	$: formDisplayStatus = Object.fromEntries(
		data.households.map((household) => [
			household.id,
			Object.fromEntries(['pets', 'persons', 'foods'].map((subgroup) => [subgroup, false])),
		]),
	);

	function toggleForm(householdId: string, subgroupName: Subgroup) {
		formDisplayStatus[householdId][subgroupName] = !formDisplayStatus[householdId][subgroupName];
	}
</script>

<main>
	<h2>Households</h2>
	{#each data.households as household}
		<article class="household">
			<div class="household_header">
				<h3 class="household_header_name">
					{household.name}
					{#if household.youAreManager}
						<span class="household_header_name_role"
							><Icon icon="material-symbols:star" />Manager<Icon
								icon="material-symbols:star"
							/></span
						>
					{/if}
				</h3>
				<a href="/dashboard/households/{household.id}/edit">Edit</a>
			</div>
			<section data-household-subgroup="pets">
				<div class="household_subgroup_header">
					<h4 class="household_subgroup_header_name">
						Pets <span class="household_subgroup_header_count">({household.pets.length})</span>
					</h4>
					<button
						class={`button button-${formDisplayStatus[household.id]['pets'] ? 'close' : 'open'}`}
						on:click={() => toggleForm(household.id, 'pets')}
						type="button">{formDisplayStatus[household.id]['pets'] ? 'Cancel' : 'Add Pet'}</button
					>
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
								<td
									>{#if pet.isPresent}<div class="icon-wrapper">
											<Icon icon="material-symbols:check-box" />
										</div>{/if}</td
								>
							</tr>
						{/each}
					</tbody>
				</table>
			</section>
			<section data-household-subgroup="persons">
				<div class="household_subgroup_header">
					<h4 class="household_subgroup_header_name">
						Persons <span class="household_subgroup_header_count">({household.persons.length})</span
						>
					</h4>
					<button
						class={`button button-${formDisplayStatus[household.id]['persons'] ? 'close' : 'open'}`}
						on:click={() => toggleForm(household.id, 'persons')}
						type="button"
						>{formDisplayStatus[household.id]['persons'] ? 'Cancel' : 'Add Person'}</button
					>
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
								<td
									>{#if person.isPresent}<div class="icon-wrapper">
											<Icon icon="material-symbols:check-box" />
										</div>{/if}</td
								>
								<td
									>{#if person.isManager}<div class="icon-wrapper">
											<Icon icon="material-symbols:check-box" />
										</div>{/if}</td
								>
								<td>{person.invitedBy ?? '—'}</td>
								<td
									>{person.invitationAccepted === true
										? 'Yes'
										: person.invitationAccepted === false
										? 'No'
										: '—'}</td
								>
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
						class={`button button-${formDisplayStatus[household.id]['foods'] ? 'close' : 'open'}`}
						on:click={() => toggleForm(household.id, 'foods')}
						type="button">{formDisplayStatus[household.id]['foods'] ? 'Cancel' : 'Add Food'}</button
					>
				</div>
				{#if formDisplayStatus[household.id]['foods']}
					<div class="household_subgroup_form-wrapper">
						<CreateFoodForm
							form={{ household: household.id }}
							disableHouseholdSelect={true}
							availableHouseholds={[]}
							successCallback={() => {
								toggleForm(household.id, 'foods');
							}}
							cancel={() => toggleForm(household.id, 'foods')}
						/>
					</div>
				{/if}
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
									><a href={`/dashboard/foods/${food.id}`}
										><Icon icon="material-symbols:edit-document" />Manage</a
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

<style lang="postcss">
	.household {
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

					&-close {
						background-color: var(--color-red);
					}

					&-open {
						background-color: var(--color-green);
					}
				}
			}

			&_form-wrapper {
			}
		}

		section {
			margin-block: 2rem;
		}
	}
</style>
