<script lang="ts">
	import '../app.postcss';
	import { page } from '$app/stores';
	import Logo from '$lib/components/Logo.svelte';
</script>

<svelte:head>
	<title>Pet Fed</title>
</svelte:head>

<header>
	<div class="content-wrapper">
		<div class="logo">
			<a href="/"><Logo /></a>
		</div>
		<nav>
			{#if $page.data.user}
				<span>Welcome back, <strong>{$page.data.user.name}</strong></span>
				<a class="button button_small" href="/dashboard">Go to Dashboard</a>
			{:else}
				<span>Already have an account?</span>
				<a class="button button_small" href="/login">Login</a>
			{/if}
		</nav>
	</div>
</header>

<main>
	<slot />
</main>

<footer />

<style lang="postcss">
	header {
		background-color: var(--color-mauve);
		padding-block: 24px;
		border-bottom: 8px solid var(--color-tan);

		.content-wrapper {
			margin: 0 auto;
			max-width: var(--width-content-max);
			display: flex;
			justify-content: space-between;
			align-items: center;

			.logo {
				height: 100%;
				padding-inline: 1rem;
				* {
					fill: var(--color-tan-light);
				}
			}

			nav {
				font-family: sans-serif;
				display: flex;
				justify-content: flex-end;
				align-items: flex-end;
				gap: 0.5rem;

				span {
					font-size: 1.4rem;
					color: var(--color-tan-light);
				}

				a {
					margin-inline: 1rem;
				}
			}
		}
	}

	main {
		/* flex: 1; */
	}

	footer {
		flex: 1;
		min-height: 60px;
		background: var(--color-mauve);
		background: linear-gradient(var(--color-tan-light), var(--color-mauve));
	}
</style>
