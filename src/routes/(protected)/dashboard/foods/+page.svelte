<script lang="ts">
	import '$lib/../app.postcss';
	import '../dashboard.postcss';
	import type { PageData } from './$types';
	import Icon from '@iconify/svelte';
	import CreateFoodForm from '$lib/components/CreateFoodForm.svelte';

	export let data: PageData;

	$: showAddFoodForm = false;
	$: addFoodMessage = '';
	function toggleShowAddFoodForm() {
		showAddFoodForm = !showAddFoodForm;
	}
</script>

<main>
	<h2>Foods</h2>
	<section class="create">
		<div class="create_message">
			{addFoodMessage}
		</div>
		{#if showAddFoodForm}
			<div class="create_form-wrapper">
				<CreateFoodForm
					form={{}}
					disableHouseholdSelect={false}
					availableHouseholds={data.availableHouseholds}
					successCallback={(data) => {
						addFoodMessage = `Successfully created new Food ${data?.food.name}`;
						showAddFoodForm = false;
					}}
					cancel={toggleShowAddFoodForm}
				/>
			</div>
		{:else}
			<button class="button create_toggle-button" on:click={toggleShowAddFoodForm}
				>Add New Food</button
			>
		{/if}
	</section>
	<section class="list">
		<ul>
			{#each data.foods as food}
				<li class="card">
					<a href={`foods/${food.id}`}>
						<div class="card_name">{food.name}</div>
						<div class="card_image"><Icon icon="game-icons:opened-food-can" /></div>
						<div class="card_details" />
					</a>
				</li>
			{/each}
		</ul>
	</section>
</main>
