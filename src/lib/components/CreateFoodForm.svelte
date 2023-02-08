<script lang="ts">
	import { enhance } from '$app/forms';
	import Input from '$lib/components/Input.svelte';
	import type { ActionData } from '../../routes/(protected)/dashboard/foods/$types';
	export let availableHouseholds: { id: string; name: string }[];
	export let disableHouseholdSelect: boolean;
	// eslint-disable-next-line  @typescript-eslint/no-explicit-any
	export let successCallback: (data?: Record<string, any> | undefined) => void;
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
		<input id="household" name="household" type="text" value={form?.household} hidden />
	{:else}
		<label for="household"
			>Household
			<div class="select">
				<select id="household" name="household">
					{#each availableHouseholds as household}
						<option value={household.id}>{household.name}</option>
					{/each}
				</select>
				<span class="focus" />
			</div>
		</label>
	{/if}
	<label for="name"
		>Name
		<Input id="name" name="name" type="text" value={form?.name || ''} placeholder="Food" required />
	</label>
	<label for="amountInStock"
		>Amount in Stock
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
		<button class="button button-cancel" type="button" on:click={cancel}>Cancel</button>
		<button class="button" type="submit">Submit</button>
	</div>
</form>

<style lang="postcss">
	form {
		padding: 1rem;
		margin: auto;
		overflow: hidden;
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
	}

	label {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 0.3em;
	}

	label:has(input[type='checkbox']) {
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		gap: 0.5em;
	}

	.header {
		font-size: 1.4rem;
		text-align: center;
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
