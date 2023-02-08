<script lang="ts">
	import '$lib/styles/form.postcss';
	import { enhance } from '$app/forms';
	import Input from '$lib/components/Input.svelte';
	import type { ActionData } from '../../routes/(protected)/dashboard/households/$types';

	export let household: { id: string; name: string };
	export let successCallback: (data?: Record<string, unknown> | undefined) => void;
	export let cancel: () => void;
	export let form: ActionData;
</script>

<form
	action="/dashboard/households?/editName"
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
	<h3 class="header">Edit Household Name</h3>
	<input id="id" name="id" type="text" value={form?.id} hidden />

	<label for="name"
		>Name
		<Input
			id="name"
			name="name"
			type="text"
			value={form?.name ?? household.name}
			placeholder={household.name}
			required
		/>
	</label>
	<div class="buttonset">
		<button class="button" type="button" data-form-action="cancel" on:click={cancel}>Cancel</button>
		<button class="button" type="submit">Submit</button>
	</div>
</form>
