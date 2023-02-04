<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { writable } from 'svelte/store';
	import { enhance } from '$app/forms';
	import Icon from '@iconify/svelte';
	import Input from '$lib/components/Input.svelte';

	$: name = writable(form?.name ?? '');

	export let form: ActionData;
	export let data: PageData;

	$: pets = data.pets;

	$: showCreatePetForm = false;

	function toggleShowCreatePetForm() {
		showCreatePetForm = !showCreatePetForm;
	}

	$: createPetMessage = writable('');
</script>

<main>
	<h2>Pets</h2>
	<section class="create">
		{#if showCreatePetForm}
			<div class="create-form-wrapper">
				<form
					action="?/createPet"
					method="POST"
					use:enhance={() => {
						return async ({ result, update }) => {
							console.log(result);
							if (result.type === 'success') {
								$createPetMessage = `Successfully created new Pet ${result.data?.name}`;
								showCreatePetForm = false;
								$name = '';
								update();
							}
						};
					}}
				>
					<h3 class="create-form-header">Add New Pet</h3>
					<label for="name"
						>Name
						<Input id="name" name="name" type="text" bind:value={$name} required />
					</label>
					<div class="buttonset">
						<button class="button button-cancel" type="button" on:click={toggleShowCreatePetForm}
							>Cancel</button
						>
						<button class="button" type="submit">Submit</button>
					</div>
				</form>
			</div>
		{:else}
			<div class="create-header">
				<div class="create-message">
					{$createPetMessage}
				</div>

				<button class="button" on:click={toggleShowCreatePetForm}
					>{showCreatePetForm ? 'Cancel' : 'Add New Pet'}</button
				>
			</div>
		{/if}
	</section>
	<section class="pets-list">
		<ul>
			{#each pets as pet}
				<li class="pet-card">
					<div class="pet-name">{pet.name}</div>
					<div class="pet-image"><Icon icon="material-symbols:pets" /></div>
					<div class="pet-details" />
				</li>
			{/each}
		</ul>
	</section>
</main>

<style lang="postcss">
	main {
		margin-top: 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	h2 {
		padding-block: 1rem;
		font-size: 2.5rem;
		font-family: 'Trocchi', serif;
		text-decoration: underline;
	}
	.create {
		width: 900px;
		display: flex;
		flex-direction: column;
	}

	.create-header {
		display: flex;
		flex-direction: column;
		align-items: center;

		button {
			font-size: 1.5rem;
			padding: 0.25em 0.5em;
		}
	}

	.create-message {
		padding-inline: 0.5rem;
		font-family: 'Gantari', sans-serif;
		font-weight: 600;
		color: var(--color-green);
	}

	.create-form-wrapper {
		label {
			font-weight: 600;
		}
	}

	.pets-list > ul {
		width: 900px;
		display: grid;

		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
	}

	li.pet-card {
		padding: 0;
		list-style: none;
		width: 100%;
		aspect-ratio: 2/1;
		border-style: solid;
		border-color: var(--color-chocolate-dark);
		border-width: 2px 3px 3px 2px;
		border-radius: 8px;
		display: grid;
		grid-template-areas:
			'name name'
			'image details';
		grid-template-columns: 30% auto;
		grid-template-rows: 20% auto;
		overflow: hidden;
	}

	.pet-name {
		display: flex;
		justify-content: center;
		align-items: center;
		border-bottom: 1px solid var(--color-chocolate-dark);
		background-color: var(--color-tan-dark);
		color: var(--color-tan-light);
		grid-area: name;
		text-align: center;
		font-family: 'Trocchi', serif;
		font-weight: 800;
	}

	.pet-image {
		flex: 1;
		grid-area: image;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: var(--color-bone);
		font-size: 7rem;
		color: var(--color-mauve);
	}

	.pet-details {
		padding: 0.5rem;
		grid-area: details;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: stretch;
		background-color: var(--color-bone);
	}

	.create-form-wrapper {
		margin: auto auto;
	}

	.create-form-header {
		font-size: 1.4rem;
		text-align: center;
	}

	.create-form-wrapper > form {
		padding: 1rem;
		margin: auto;
		display: flex;
		flex-direction: column;
		gap: 1em;
		background: var(--color-bone);
		border: 2px solid var(--color-chocolate-dark);
		border-radius: 8px;
		font-family: 'Gantari', sans-serif;
		font-size: 1.5rem;
		box-shadow: 1.9px 1.4px 3.4px rgba(0, 0, 0, 0.034), 4.7px 3.3px 8.2px rgba(0, 0, 0, 0.048),
			8.8px 6.3px 15.4px rgba(0, 0, 0, 0.06), 15.6px 11.2px 27.5px rgba(0, 0, 0, 0.072),
			29.2px 20.9px 51.4px rgba(0, 0, 0, 0.086);
		overflow: hidden;
	}

	.buttonset {
		display: flex;
		justify-content: space-evenly;
		.button {
			font-size: 1.3rem;
			padding: 0.25em 0.5em;
			cursor: pointer;
		}
	}

	.button-cancel {
		background-color: var(--color-red);
	}
</style>
