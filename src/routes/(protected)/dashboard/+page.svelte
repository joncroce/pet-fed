<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ pets } = data);
</script>

<h1>Dashboard</h1>

{#if $page.data.user}
	<p>Welcome {$page.data.user.name}!</p>
{/if}

{#if pets}
	There are pets! {JSON.stringify(pets, undefined, 2)}
{/if}
