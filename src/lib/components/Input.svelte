<script lang="ts">
	export let value = '';
	export let id = '';
	export let name = '';
	export let type = 'text';
	export let required = false;
	const onInput = (e: Event) => (value = (e.target as HTMLInputElement).value);
</script>

<input {id} {type} {name} {required} {value} on:input={onInput} />

<style>
	input {
		padding: 0.25em;
		font-size: 1.1em;
		font-family: monospace;
	}
</style>
