<script lang="ts">
	import type { ActionData } from './$types';
	import { writable } from 'svelte/store';
	import Input from '$lib/components/Input.svelte';
	import Icon from '@iconify/svelte';

	export let form: ActionData;

	const usernameValidationMessage = `6-24 characters long. Letters, numbers, underscores, and hyphens only.`;
	const usernameValidationRegex = /^[\w-]{6,24}$/;

	const passwordValidationMessage = `8-32 characters long.`;
	const passwordValidationRegex = /^[\w~`!@#$%^&*()\-+={[}\]|\\:;"'<,>.?/]{8,32}$/;

	$: username = writable(form?.username ?? '');
	$: password = writable(form?.password ?? '');

	$: usernameStatus =
		$username.length === 0 ? 'EMPTY' : usernameValidationRegex.test($username) ? 'OK' : 'ERROR';

	$: passwordStatus =
		$password.length === 0 ? 'EMPTY' : passwordValidationRegex.test($password) ? 'OK' : 'ERROR';

	$: submitDisabled =
		form?.username === $username ||
		![usernameStatus, passwordStatus].every((status: string) => status === 'OK');
</script>

<svelte:head>
	<title>Pet Fed — Sign Up</title>
</svelte:head>

<main>
	<form action="?/register" method="POST">
		<h2>Create your account</h2>
		<div class="form-field">
			<label for="username"
				>Username<Input id="username" name="username" type="text" bind:value={$username} required />
				<figure>
					<figcaption data-validation-status={usernameStatus}>
						{usernameValidationMessage}
					</figcaption>
				</figure></label
			>
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
				<figure>
					<figcaption data-validation-status={passwordStatus}>
						{passwordValidationMessage}
					</figcaption>
				</figure></label
			>
		</div>

		{#if form?.user}
			<figure class="error-message">
				<figcaption>
					<Icon icon="material-symbols:error" />Username
					<span class="username">{form?.username}</span> is taken.
				</figcaption>
			</figure>
		{/if}

		<div class="form-controls">
			<button class="button" type="submit" disabled={submitDisabled}>Sign Up</button>
		</div>
	</form>
</main>
