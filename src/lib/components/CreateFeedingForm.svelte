<script lang="ts">
	import '$lib/styles/form.postcss';
	import dayjs from 'dayjs';
	import { enhance } from '$app/forms';
	import Input from '$lib/components/Input.svelte';
	import type { ActionData } from '../../routes/(protected)/dashboard/feedings/$types';
	import type { Feeding, Food, Pet } from '@prisma/client';
	export let feeding: Partial<Feeding>;
	export let availablePets: Partial<Pet>[];
	export let availableFoods: Partial<Food>[];
	export let successCallback: (data?: Record<string, unknown> | undefined) => void;
	export let cancel: () => void;
	export let form: ActionData;

	$: selectedPet = availablePets.find(
		(pet) => feeding.petId && pet.id === feeding.petId,
	) as Partial<Pet> | null;

	$: selectedFood = availableFoods.find(
		(food) => feeding.foodId && food.id === feeding.foodId,
	) as Partial<Food> | null;

	$: insufficientAmountInStockError =
		!selectedFood?.minFractionalAmount ||
		!selectedFood.amountInStock ||
		selectedFood.minFractionalAmount > selectedFood.amountInStock;
</script>

<form
	action="/dashboard/feedings?/create"
	method="POST"
	use:enhance={() => {
		return async ({ result, update }) => {
			console.log(result);
			if (result.type === 'success') {
				successCallback(result?.data);
				update();
			}
		};
	}}
>
	<h3 class="header">Add New Feeding</h3>
	<label for="petId">
		Pet
		<div class="select">
			<select
				id="petId"
				name="petId"
				value={selectedPet?.id}
				on:change={(event) => (feeding.petId = event.currentTarget.value)}
			>
				{#each availablePets as pet}
					<option value={pet.id}>
						{pet.name}
					</option>
				{/each}
			</select>
			<span class="focus" />
		</div>
	</label>
	<label for="foodId">
		Food
		<div class="select">
			<select
				id="foodId"
				name="foodId"
				value={selectedFood?.id}
				on:change={(event) => (feeding.foodId = event.currentTarget.value)}
			>
				{#each availableFoods as food}
					<option value={food.id}>
						{food.name}
					</option>
				{/each}
			</select>
			<span class="focus" />
		</div>
	</label>
	{#if selectedFood}
		{#if insufficientAmountInStockError}
			<div class="error">Insufficient quantity in stock for feeding.</div>
		{:else}
			<label for="amount">
				Amount
				<span class="input-wrapper">
					<Input
						id="amount"
						name="amount"
						type="number"
						value={form?.amount ?? selectedFood.minFractionalAmount}
						placeholder={String(selectedFood.minFractionalAmount) ?? '0'}
						min={selectedFood.minFractionalAmount}
						max={selectedFood.amountInStock}
						step={selectedFood.minFractionalAmount}
						disabled={insufficientAmountInStockError}
					/>
					<span class="unitName">{selectedFood.unitName}</span>
				</span>
			</label>

			<input id="unitName" name="unitName" type="text" value={selectedFood.unitName} hidden />
		{/if}
	{/if}
	<label for="date">
		Date
		<input
			id="date"
			name="date"
			type="date"
			value={dayjs(feeding.timestamp ?? Date.now())
				.format()
				.slice(0, 10)}
		/>
	</label>
	<label for="time">
		Time
		<input
			id="time"
			name="time"
			type="time"
			value={dayjs(feeding.timestamp ?? Date.now())
				.format()
				.slice(11, 16)}
		/>
	</label>
	<input
		id="tz"
		name="tz"
		type="string"
		value={Intl.DateTimeFormat().resolvedOptions().timeZone}
		hidden
	/>
	<div class="buttonset">
		<button class="button" type="button" data-form-action="cancel" on:click={cancel}>Cancel</button>
		<button class="button" type="submit">Submit</button>
	</div>
</form>

<style lang="postcss">
	.error {
		color: var(--color-red-dark);
		text-align: center;
		font-weight: 600;
	}
</style>
