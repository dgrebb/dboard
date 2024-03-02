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

	// export let data;
	let items: Item[] = [];
	let weather: { temperature: any }[];

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

	const nightscoutData = async () => {
		const res = await fetch('/api/nightscout');
		const data = await res.json();
		console.log('Data from GET endpoint', data);
		// logEvent(`[GET] data received: ${JSON.stringify(data)}`);
		const { nightscout } = data;
		items = nightscout.items;
	};

	// const weatherData = async () => {
	// 	const res = await fetch('/api/weather');
	// 	const hours = await res.json();
	// 	weather = hours.data;
	// 	console.log('🚀 ~ weatherData ~ weather:', weather);
	// };

	const closeSocket = () => {
		ws?.close();
	};

	interface Item {
		requestInterval: number;
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

	onMount(async () => {
		nightscoutData();
		// weatherData();
		setInterval(async () => {
			nightscoutData();
			// weatherData();
		}, 333333);
	});
</script>

<main>
	<Button on:click={closeSocket}>Stop Socket</Button>

	<button disabled={webSocketEstablished} on:click={() => establishWebSocket()}>
		Establish WebSocket connection
	</button>

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
		<!-- {#each weather as { temperature }}
			<h1 class="text-7xl">{temperature}</h1>
		{/each} -->
		<!-- <Card>
			<h2>Lansdale</h2>
			<p>{weather[1].temperature}</p>
			<p>{weather[2].temperature}</p>
			<p>{weather[3].temperature}</p>
			<p>{weather[4].temperature}</p>
		</Card> -->
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
