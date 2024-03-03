<script>
	export let seconds;
	export let refreshInterval;
	$: progress = ((seconds * 1000) / refreshInterval) * 100;
</script>

<div
	class="progress-bar bg-gray-950 transition-[width] dark:bg-gray-50"
	style="width: {progress}%"
></div>

<style>
	.progress-bar {
		transition-property: width;
		transition-duration: 2000ms;
		height: 0.25rem;
	}
</style>
