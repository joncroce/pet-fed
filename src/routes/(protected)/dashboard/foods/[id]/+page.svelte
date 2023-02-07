<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<main>
	<pre>{JSON.stringify(data.food, undefined, 2)}</pre>
</main>
