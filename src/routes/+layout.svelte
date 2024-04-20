<script lang="ts">
	import '../app.css'
	export let data

	let scrollY: number
	let goingUp = false
	let lastScroll = 0
	$: {
		if (scrollY < lastScroll) {
			goingUp = false
		} else {
			goingUp = true
		}
		lastScroll = scrollY
	}
</script>

<svelte:window bind:scrollY />
<header
	class="sticky top-0 z-10 grid place-items-center gap-4 bg-zinc-900 p-3 font-mono text-white transition-all duration-300 ease-in-out md:grid-cols-3"
	class:goingUp>
	<h1 class="text-3xl font-bold text-lime-400 sm:text-6xl">Dark Scanner</h1>
	<nav>
		<a href="https://github.com/derekhearst/DarkScanner" class="text-3xl" target="_blank">Download</a>
	</nav>
	<nav class="text-3xl">
		{#if data.user}
			<a class="cursor-pointer" href="api/github/logout"> Logout </a>
		{:else}
			<a class="cursor-pointer" href="api/github"> Login </a>
		{/if}
	</nav>
</header>

<slot />

<!-- <dialog class="dialog" bind:this={dialogEl}><div>AGH</div></dialog> -->

<style>
	.goingUp {
		top: -180px;
	}
	@media (max-width: 768px) {
		.goingUp {
			top: -400px;
		}
	}
</style>
