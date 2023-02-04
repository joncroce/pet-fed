<script lang="ts">
	import Icon from '@iconify/svelte';
</script>

<main>
	<nav>
		<ul>
			<li>
				<a href="/dashboard/pets"
					><div class="header">Pets</div>
					<div class="icon"><Icon icon="teenyicons:paws-solid" /></div></a
				>
			</li>
			<li>
				<a href="/dashboard/foods"
					><div class="header">Foods</div>
					<div class="icon"><Icon icon="game-icons:opened-food-can" /></div></a
				>
			</li>
			<li>
				<a href="/dashboard/analytics"
					><div class="header">Analytics</div>
					<div class="icon">
						<Icon icon="teenyicons:area-chart-alt-solid" />
					</div></a
				>
			</li>
		</ul>
	</nav>
</main>

<style lang="postcss">
	main {
		margin: 0 auto;
		display: flex;

		nav {
			padding-block: 2rem;

			ul {
				list-style: none;
				display: grid;
				grid-template-columns: repeat(3, min(25vw, 400px));
				gap: 1rem;

				li {
					width: 100%;
					aspect-ratio: 16 / 9;
					border-style: solid;
					border-color: var(--color-chocolate-dark);
					border-width: 3px 4px 4px 3px;
					border-radius: 8px;
					background-color: var(--color-gold);
					box-shadow: 1.9px 1.4px 3.4px rgba(0, 0, 0, 0.034), 4.7px 3.3px 8.2px rgba(0, 0, 0, 0.048),
						8.8px 6.3px 15.4px rgba(0, 0, 0, 0.06), 15.6px 11.2px 27.5px rgba(0, 0, 0, 0.072),
						29.2px 20.9px 51.4px rgba(0, 0, 0, 0.086);

					a {
						display: flex;
						flex-direction: column;
						align-items: stretch;
						text-decoration: none;
						height: 100%;

						.header {
							display: flex;
							justify-content: center;
							padding-block: 0.25em;
							padding-inline: 0.5em;
							border-bottom: 2px solid var(--color-chocolate-dark);
							font-size: 2rem;
							font-family: 'Trochhi', serif;
							font-weight: 600;
							line-height: 1;
							color: black;
						}

						.icon {
							display: flex;
							justify-content: center;
							align-items: center;
							flex: 1;
							font-size: 7rem;
							color: var(--color-mauve);
						}
					}
				}
			}
		}
	}
</style>
