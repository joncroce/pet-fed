<script class="ts">
	import { page } from '$app/stores';
	import LogoSVG from '$lib/components/LogoSVG.svelte';
</script>

<svelte:head>
	<title>Pet Fed</title>
</svelte:head>

<header>
	<div class="content-wrapper">
		<div class="logo">
			<a href="/"><LogoSVG /></a>
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
	<section class="invitation">
		<div class="hero" />
		<div class="join-now">
			<div class="logo-wrapper">
				<LogoSVG />
			</div>
			<div class="pitch">
				Make sure that they never miss a meal by conveniently managing your pets' feeding times.
			</div>
			<a class="button button_large" href={$page.data.user ? '/dashboard' : '/signup'}
				>{$page.data.user ? 'Go to Dashboard' : 'Join Now'}</a
			>
			{#if $page.data.user}
				<form action="/logout" method="POST">
					<button class="logout" type="submit">Logout of your account</button>
				</form>
			{/if}
		</div>
	</section>
</main>

<footer />

<style lang="postcss">
	header {
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
	section.invitation {
		margin-block: 8rem;
		display: grid;
		grid-template-columns: calc(100vw - 600px) 600px;
		grid-template-rows: clamp(480px, auto, 100vh);
	}

	.hero {
		border-radius: 4px;
		background-color: oklch(94% 0.1 103.24);
		background-image: url(./hero.webp);
		background-attachment: local;
		background-position: right;
		background-size: cover;
		background-clip: border-box;
		box-shadow: 1.9px 1.4px 3.4px rgba(0, 0, 0, 0.034), 4.7px 3.3px 8.2px rgba(0, 0, 0, 0.048),
			8.8px 6.3px 15.4px rgba(0, 0, 0, 0.06), 15.6px 11.2px 27.5px rgba(0, 0, 0, 0.072),
			29.2px 20.9px 51.4px rgba(0, 0, 0, 0.086);
	}

	.join-now {
		padding-block: 4rem 2rem;
		padding-inline: 4rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		text-align: center;

		.logo-wrapper {
			flex-basis: 30%;
		}

		.pitch {
			font-family: 'Trocchi', serif;
			font-weight: 400;
			font-size: 1.8rem;
			line-height: 1.55;
			padding-block: 2rem;
		}
	}

	.logout {
		margin-top: 1.2rem;
		background-color: transparent;
		border: none;
		font-family: 'Gantari', sans-serif;
		font-size: 1.3rem;
		text-decoration: underline;
		color: var(--color-red);
		cursor: pointer;
	}

	footer {
		flex: 1;
		min-height: 60px;
		background: var(--color-mauve);
		background: linear-gradient(var(--color-tan-light), var(--color-mauve));
	}
</style>
