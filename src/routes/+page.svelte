<script lang="ts">
	// import { onMount } from 'svelte';
	// $lib auto-resolves to ./src/lib in Svelte.
	// import { state, connect } from '$lib/state';
	import { Button } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { Card } from 'flowbite-svelte';

	let webSocketEstablished = false;
	let ws: WebSocket | null = null;
	let log: string[] = [];

	const logEvent = (str: string) => {
		log = [...log, str];
	};

	const establishWebSocket = () => {
		if (webSocketEstablished) return;
		const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
		ws = new WebSocket(`${protocol}//${window.location.host}/websocket`);
		ws.addEventListener('open', (event) => {
			webSocketEstablished = true;
			console.log('[websocket] connection open', event);
			logEvent('[websocket] connection open');
		});
		ws.addEventListener('close', (event) => {
			console.log('[websocket] connection closed', event);
			logEvent('[websocket] connection closed');
		});
		ws.addEventListener('message', (event) => {
			console.log('[websocket] message received', event);
			logEvent(`[websocket] message received: ${event.data}`);
		});
	};

	const requestData = async () => {
		const res = await fetch('/api/test');
		const data = await res.json();
		console.log('Data from GET endpoint', data);
		// logEvent(`[GET] data received: ${JSON.stringify(data)}`);
		return data;
	};

	const closeSocket = () => {
		ws?.close();
	};

	interface Item {
		title: string;
		content: {
			small: {
				value: string;
				color: string;
			};
			large: {
				value: string;
				color: string;
			};
		};
	}

	// export let data;
	let items: Item[] = [];

	onMount(async () => {
		setInterval(async () => {
			const { data } = await requestData();
			console.log('🚀 ~ onMount ~ data:', data);
			items = data.items;
		}, 3333);

		console.log('🚀 ~ items:', items);
	});
</script>

<main>
	<Button on:click={closeSocket}>Stop Socket</Button>
	<h1>SvelteKit with WebSocket Integration</h1>

	<button disabled={webSocketEstablished} on:click={() => establishWebSocket()}>
		Establish WebSocket connection
	</button>

	<button on:click={() => requestData()}> Request Data from GET endpoint </button>

	<ul>
		{#each log as event}
			<li>{event}</li>
		{/each}
	</ul>

	<div class="p-8">
		{#each items as { title, content: { small, large } }}
			<Card>
				<h2>{title}</h2>
				<h1 class="text-7xl">{large.value}</h1>
				<p>{small.value}</p>
			</Card>
		{/each}
	</div>
</main>

<style>
	h1 {
		color: red;
	}
	main {
		font-family: sans-serif;
	}
</style>
