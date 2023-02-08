<script lang="ts">
	import { page } from '$app/stores';
	import LogoSVG from '$lib/components/LogoSVG.svelte';

	$: breadcrumbs = $page.url.pathname.split('/').slice(1);
</script>

<svelte:head>
	<title>Pet Fed — Dashboard</title>
</svelte:head>

<header>
	<div class="content-wrapper">
		<div class="logo">
			<a href="/"><LogoSVG /></a>
		</div>
		<div class="user-info">
			{#if $page.data.user}
				<span>Logged in as <strong>{$page.data.user.name}</strong></span>
				<form class="fieldless" action="/logout" method="POST">
					<button class="button" type="submit">Logout</button>
				</form>
			{/if}
		</div>
	</div>
</header>

<nav>
	<ol class="breadcrumbs">
		{#each breadcrumbs as crumb, i}
			<li>
				<a href={`/${breadcrumbs.slice(0, i + 1).join('/')}`}
					>{`${crumb[0].toUpperCase()}${crumb.slice(1)}`}</a
				>
			</li>
		{/each}
	</ol>
</nav>
<slot />

<style lang="postcss">
	header {
		padding-block: 0.5rem;
		padding-inline: 1rem;

		.content-wrapper {
			margin: 0 auto;
			max-width: var(--width-content-max);
			display: flex;
			justify-content: space-between;
			align-items: center;

			.logo {
				display: flex;
				padding-inline: 1rem;
				* {
					fill: var(--color-tan-light);
				}
			}

			.user-info {
				font-family: sans-serif;
				display: flex;
				justify-content: flex-end;
				align-items: flex-end;
				gap: 0.5rem;

				span {
					font-size: 1.4rem;
					color: var(--color-tan-light);
				}

				button {
					font-size: 1.3rem;
				}
			}
		}
	}

	nav {
		border-bottom: 8px solid var(--color-tan);
		background: var(--color-tan);

		ol.breadcrumbs {
			max-width: var(--width-content-max);
			display: flex;
			justify-content: flex-start;
			align-items: center;
			margin: 0 auto;
			padding-inline: 0.5rem;
			gap: 0.25rem;
			list-style: none;
			font-family: 'Gantari', sans-serif;
			line-height: 1;
			font-weight: 600;

			li:not(:first-of-type):before {
				padding-inline: 0.5em;
				content: '>';
			}

			li:last-of-type {
				font-weight: 800;
			}
		}
	}
</style>
