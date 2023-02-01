<script class="ts">
	import Logo from '$lib/components/Logo.svelte';
</script>

<section class="invitation">
	<div class="hero" />
	<div class="join-now">
		<div class="logo-wrapper">
			<Logo />
		</div>
		<div class="pitch">
			Make sure that they never miss a meal by conveniently managing your pets' feeding times.
		</div>
		<a class="button button_large" href="/register">Join Now</a>
	</div>
</section>

<style lang="postcss">
	section.invitation {
		margin-block: 8rem;
		display: grid;
		grid-template-columns: auto 600px;
		grid-template-rows: clamp(480px, auto, 100vh);
	}

	.hero {
		/* border-width: 8px 8px 8px 0px;
		border-style: solid;
		border-color: var(--color-tan); */
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
</style>
