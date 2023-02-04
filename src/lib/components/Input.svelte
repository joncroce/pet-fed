<script lang="ts">
	export let value = '';
	export let step = 1;
	export let min: string | number | null | undefined = null;
	export let max: string | number | null | undefined = null;
	export let id = '';
	export let name = '';
	export let type = 'text';
	export let placeholder: string | null | undefined = '';
	export let required = false;
	const onInput = (e: Event) => (value = (e.target as HTMLInputElement).value);
</script>

<input {id} {type} {name} {placeholder} {required} {value} {step} {min} {max} on:input={onInput} />

<style>
	input {
		padding: 0.25em;
		font-size: 1.1em;
		font-family: monospace;
	}
</style>
