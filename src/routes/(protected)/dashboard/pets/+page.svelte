<script lang="ts">
	import '$lib/../app.postcss';
	import '../dashboard.postcss';
	import { enhance } from '$app/forms';
	import Input from '$lib/components/Input.svelte';
	import Icon from '@iconify/svelte';
	import type { ActionData, PageData } from './$types';

	export let form: ActionData;
	export let data: PageData;

	$: showCreatePetForm = false;
	$: createPetMessage = '';

	function toggleShowCreatePetForm() {
		showCreatePetForm = !showCreatePetForm;
	}
</script>

<main>
	<h2>Pets</h2>
	<section class="create">
		<div class="create_message">
			{createPetMessage}
		</div>
		{#if showCreatePetForm}
			<div class="create_form-wrapper">
				<form
					action="?/createPet"
					method="POST"
					use:enhance={() => {
						return async ({ result, update, form }) => {
							console.log(result);
							if (result.type === 'success') {
								createPetMessage = `Successfully created new Pet ${result.data?.name}`;
								showCreatePetForm = false;
								form.name = '';
								update();
							}
						};
					}}
				>
					<h3 class="create_form_header">Add New Pet</h3>
					<label for="name"
						>Name
						<Input
							id="name"
							name="name"
							type="text"
							placeholder=""
							value={form?.name || ''}
							required
						/>
					</label>
					<div class="create_form_buttonset">
						<button class="button button-cancel" type="button" on:click={toggleShowCreatePetForm}
							>Cancel</button
						>
						<button class="button" type="submit">Submit</button>
					</div>
				</form>
			</div>
		{:else}
			<button class="button create_toggle-button" on:click={toggleShowCreatePetForm}
				>Add New Pet</button
			>
		{/if}
	</section>
	<section class="list">
		<ul>
			{#each data.pets as pet}
				<li class="card">
					<a href={`pets/${pet.id}`}>
						<div class="card_name">{pet.name}</div>
						<div class="card_image"><Icon icon="material-symbols:pets" /></div>
						<div class="card_details" />
					</a>
				</li>
			{/each}
		</ul>
	</section>
</main>
