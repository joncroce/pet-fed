<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ cats } = data);
</script>

<h1>Cats</h1>

<p>Showing {cats.length} cats.</p>

<ul>
	{#each cats as cat}
		<li>
			{cat.name}
		</li>
	{/each}
</ul>
