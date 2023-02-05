<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Pet Fed — Details for {data.pet.name ?? ''} (Pet)</title>
</svelte:head>

<main>
	<h2>{data.pet.name}</h2>
	<section class="persons">
		<h3>Persons</h3>
		{#if data.pet.persons.length}
			<table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Is Owner</th>
					</tr>
				</thead>
				<tbody>
					{#each data.pet.persons as person}
						<tr>
							<td>{person.name}</td>
							<td
								>{#if person.isOwner}<div class="icon-wrapper">
										<Icon icon="material-symbols:check-box" />
									</div>{/if}</td
							>
						</tr>
					{/each}
				</tbody>
			</table>
		{:else}
			<em>No Persons to Display</em>
		{/if}
	</section>
	<section class="households">
		<h3>Households</h3>
		{#if data.pet.households.length}
			<table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Is Present</th>
					</tr>
				</thead>
				<tbody>
					{#each data.pet.households as household}
						<tr>
							<td>{household.name}</td>
							<td
								>{#if household.isPresent}<div class="icon-wrapper">
										<Icon icon="material-symbols:check-box" />
									</div>{/if}</td
							>
						</tr>
					{/each}
				</tbody>
			</table>
		{:else}
			<em>No Households to Display</em>
		{/if}
	</section>
	<section class="feedings">
		<h3>Feedings</h3>
		{#if data.pet.feedings.length}
			<table>
				<thead>
					<tr>
						<th>When</th>
						<th>Person</th>
						<th>Household</th>
					</tr>
				</thead>
				<tbody>
					{#each data.pet.feedings as feeding}
						<tr>
							<td>{feeding.time}</td>
							<td>{feeding.person?.displayName ?? ''}</td>
							<td>{feeding.household?.name || ''}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{:else}
			<em>No Feeding History Available</em>
		{/if}
	</section>
	<section class="options">
		<h3>Options</h3>
		<ul class="options_list">
			{#if data.youAreOwner}
				<li>
					<h4>Permanently Delete Pet</h4>
					<form
						action="?/deletePet"
						method="POST"
						use:enhance={() => {
							return async ({ result }) => {
								if (result.type === 'success') {
									goto('/dashboard/pets', {
										invalidateAll: true
									});
								}
							};
						}}
					>
						<button class="button button-warn" type="submit">Delete</button>
					</form>
				</li>
			{/if}
		</ul>
	</section>
</main>

<form
	action="?/deletePet"
	method="POST"
	use:enhance={() => {
		return async ({ result }) => {
			if (result.type === 'success') {
				goto('/dashboard/pets', {
					invalidateAll: true
				});
			}
		};
	}}
>
	<button type="submit">Delete</button>
</form>

<style lang="postcss">
	h2 {
		padding-block: 1rem;
		font-size: 2.5rem;
		font-family: 'Trocchi', serif;
		text-decoration: underline;
	}

	h3 {
		padding-block: 0.8rem;
		font-size: 2.1rem;
		font-family: 'Gantari', sans-serif;
		text-align: center;
	}

	.persons,
	.households,
	.feedings {
		align-self: stretch;
		padding-inline: 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	table,
	th,
	td {
		border: 1px solid var(--color-chocolate-dark);
		font-size: 1.2rem;
	}

	th,
	td {
		padding: 0.25em 0.5em;
		text-align: center;
	}

	.icon-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.options_list {
		li {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			gap: 1rem;
			font-size: 1.2rem;
			font-family: 'Gantari', sans-serif;

			button {
				font-size: inherit;
			}
		}
	}

	.button-warn {
		background-color: var(--color-red);
	}
</style>
