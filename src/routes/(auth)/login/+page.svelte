<script lang="ts">
	import type { ActionData } from './$types';
	import { writable } from 'svelte/store';
	import Input from '$lib/components/Input.svelte';
	import Icon from '@iconify/svelte';

	export let form: ActionData;

	$: username = writable(form?.username ?? '');
	$: password = writable(form?.password ?? '');

	$: submitDisabled = ![$username, $password].every((field) => field.length);
</script>

<svelte:head>
	<title>Pet Fed — Login</title>
</svelte:head>

<main>
	<form action="?/login" method="POST">
		<h2>Login to your account</h2>
		<div class="form-field">
			<label for="username"
				>Username<Input id="username" name="username" type="text" bind:value={$username} required />
			</label>
		</div>
		<div class="form-field">
			<label for="password"
				>Password<Input
					id="password"
					name="password"
					type="password"
					bind:value={$password}
					required
				/>
			</label>
		</div>

		{#if form?.invalid || form?.credentials}
			<figure class="error-message">
				<figcaption>
					<Icon icon="material-symbols:error" />
				</figcaption>
			</figure>
		{/if}

		<div class="form-controls">
			<button class="button" type="submit" disabled={submitDisabled}>Login</button>
		</div>
	</form>
</main>
