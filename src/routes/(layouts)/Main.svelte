<script>
	import { invalidateAll } from '$app/navigation';
	import '$lib/app.pcss';
	import { Button, DarkMode } from 'flowbite-svelte';
	import { RefreshOutline } from 'flowbite-svelte-icons';

	function refresh() {
		invalidateAll();
	}
</script>

<main>
	<header class="flex flex-row justify-between p-3">
		<slot name="additional-controls" />
		<DarkMode></DarkMode>
		<Button size="sm" color="light" on:click={() => refresh()}><RefreshOutline /></Button>
	</header>
	<slot />
</main>
