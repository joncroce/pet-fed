<script lang="ts">
	import '../app.postcss';
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Pet Fed</title>
</svelte:head>

<nav>
	{#if !$page.data.user}
		<a href="/login">Login</a>
		<a href="/register">Register</a>
	{/if}

	{#if $page.data.user}
		<a href="/dashboard">Dashboard</a>

		<form action="/logout" method="POST">
			<button type="submit">Log out</button>
		</form>
	{/if}
</nav>

<main>
	<slot />
</main>
