<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Pet Fed — Feeding {data.pet.name}</title>
</svelte:head>

<main>
	<pre>{JSON.stringify(data.pet, undefined, 2)}</pre>
</main>
