<script lang="ts">
	import '$lib/../app.postcss';
	import '../dashboard.postcss';
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';
	import Input from '$lib/components/Input.svelte';
	import Icon from '@iconify/svelte';

	export let form: ActionData;
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
				<form
					action="?/create"
					method="POST"
					use:enhance={() => {
						return async ({ result, update }) => {
							console.log(result);
							if (result.type === 'success') {
								addFoodMessage = `Successfully created new Food ${result.data?.name}`;
								showAddFoodForm = false;
								update();
							}
						};
					}}
				>
					<h3 class="create_form_header">Add New food</h3>
					<label for="name"
						>Name
						<Input
							id="name"
							name="name"
							type="text"
							value={form?.name || ''}
							placeholder="Food"
							required
						/>
					</label>
					<label for="amountInStock"
						>Amount in Stock
						<Input
							id="amountInStock"
							name="amountInStock"
							type="number"
							value={form?.amountInStock || null}
							placeholder="1"
							min={0}
							max={10_000}
						/>
					</label>
					<label for="unitName">
						Unit Name
						<Input
							id="unitName"
							name="unitName"
							type="text"
							value={form?.unitName || ''}
							placeholder="Units"
						/>
					</label>
					<label for="minFractionalAmount"
						>Minimum Fractional Amount
						<Input
							id="minFractionalAmount"
							name="minFractionalAmount"
							type="number"
							value={form?.minFractionalAmount || null}
							step={0.05}
							placeholder="1.0"
							min={0.05}
							max={1}
						/>
					</label>
					<div class="create_form_buttonset">
						<button class="button button-cancel" type="button" on:click={toggleShowAddFoodForm}
							>Cancel</button
						>
						<button class="button" type="submit">Submit</button>
					</div>
				</form>
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
