<script lang="ts">
	import '$lib/styles/form.postcss';
	import { enhance } from '$app/forms';
	import Input from '$lib/components/Input.svelte';
	import type { ActionData } from '../../routes/(protected)/dashboard/foods/$types';

	export let availableHouseholds: { id: string; name: string }[];
	export let disableHouseholdSelect: boolean;
	export let successCallback: (data?: Record<string, unknown> | undefined) => void;
	export let cancel: () => void;
	export let form: ActionData;
</script>

<form
	action="/dashboard/foods?/create"
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
	<h3 class="header">Add New food</h3>
	{#if disableHouseholdSelect}
		<input id="householdId" name="householdId" type="text" value={form?.householdId} hidden />
	{:else}
		<label for="householdId">
			Household
			<div class="select">
				<select id="householdId" name="householdId">
					{#each availableHouseholds as household}
						<option value={household.id}>
							{household.name}
						</option>
					{/each}
				</select>
				<span class="focus" />
			</div>
		</label>
	{/if}
	<label for="name">
		Name
		<Input id="name" name="name" type="text" value={form?.name || ''} placeholder="Food" required />
	</label>
	<label for="amountInStock">
		Amount in Stock
		<Input
			id="amountInStock"
			name="amountInStock"
			type="number"
			value={form?.amountInStock || null}
			placeholder="0"
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
	<div class="buttonset">
		<button class="button" type="button" data-form-action="cancel" on:click={cancel}>Cancel</button>
		<button class="button" type="submit">Submit</button>
	</div>
</form>
