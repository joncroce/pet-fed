<script lang="ts">
	import '$lib/../app.postcss';
	import '../dashboard.postcss';
	import type { PageData } from './$types';
	import Icon from '@iconify/svelte';
	import Modal, { bind } from 'svelte-simple-modal';
	import FoodForm from '$lib/components/CreateFoodForm.svelte';
	import type { Component } from 'svelte-simple-modal/types/Modal.svelte';
	import { writable, type Writable } from 'svelte/store';
	import type { ComponentProps } from 'svelte';
	import type { Food } from '@prisma/client';

	const modal: Writable<Component | null> = writable(null);

	const showCreateFoodModal = () =>
		modal.set(
			bind(FoodForm, {
				form: {},
				actionType: 'create',
				disableHouseholdSelect: false,
				availableHouseholds: data.availableHouseholds,
				successCallback: (data) => {
					const newFood = data?.food as Partial<Food>;
					console.log('Successfully created food.');
					addFoodMessage = `Successfully created new Food ${newFood.name}`;
					modal.set(null);
				},
				cancel: () => modal.set(null),
			} as ComponentProps<FoodForm>),
		);

	$: addFoodMessage = '';

	export let data: PageData;
</script>

<Modal show={$modal}>
	<main>
		<h2>Foods</h2>
		<section class="create">
			<div class="create_message">
				{addFoodMessage}
			</div>
			<button class="button create_toggle-button" on:click={showCreateFoodModal}
				>Add New Food</button
			>
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
</Modal>
