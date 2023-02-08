<script lang="ts">
	import '$lib/styles/form.postcss';
	import { enhance } from '$app/forms';
	import Input from '$lib/components/Input.svelte';
	import type { ActionData } from '../../routes/(protected)/dashboard/foods/$types';
	import type { Food } from '@prisma/client';
	export let food: Partial<Food>;
	export let successCallback: (data?: Record<string, unknown> | undefined) => void;
	export let cancel: () => void;
	export let form: ActionData;
</script>

<form
	action="/dashboard/foods?/edit"
	method="POST"
	use:enhance={() => {
		return async ({ result, update }) => {
			if (result.type === 'success') {
				successCallback(result?.data);
				update();
			}
		};
	}}
>
	<h3 class="header">Edit Food</h3>
	<input id="id" name="id" type="text" value={food.id} hidden />
	<label for="name"
		>Name
		<Input
			id="name"
			name="name"
			type="text"
			value={form?.name ?? food.name}
			placeholder={food.name}
			required
		/>
	</label>
	<label for="amountInStock"
		>Amount in Stock
		<Input
			id="amountInStock"
			name="amountInStock"
			type="number"
			value={form?.amountInStock ?? food.amountInStock}
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
			value={form?.unitName ?? food.unitName}
			placeholder="Units"
		/>
	</label>
	<label for="minFractionalAmount"
		>Minimum Fractional Amount
		<Input
			id="minFractionalAmount"
			name="minFractionalAmount"
			type="number"
			value={form?.minFractionalAmount ?? food.minFractionalAmount}
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
