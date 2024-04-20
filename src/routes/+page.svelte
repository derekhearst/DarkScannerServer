<script lang="ts">
	export let data
	let hideSmokey = true
</script>

<svelte:head>
	<meta name="description" content="DarkScanner, your one stop shop for getting the prices of dark and darker items" />
	<meta name="keywords" content="Dark and Darker, DarkScanner, OCR, Price Gathering, Prices" />
	<meta name="author" content="Derek Hearst" />
	<title>Dark Scanner</title>
</svelte:head>

<section class="niceBg -mb-36 flex min-h-96 flex-col items-center justify-center gap-2 p-4 py-10 md:mb-0 md:flex-row">
	<div class="flex flex-col items-center gap-4">
		<h2 class="font-mono text-6xl text-lime-400">Dark Scanner</h2>
		<h3 class="text-3xl italic">Your one stop shop for finding out item prices in Dark and Darker</h3>
		<p class="text-2xl">
			You can download here :
			<a class="underline underline-offset-2" href="https://github.com/derekhearst/DarkScanner" target="_blank">
				Github
			</a>
		</p>
	</div>
</section>
<section class="mt-4 flex flex-col items-center">
	<h3 class=" text-5xl font-bold">Item Stats</h3>

	<table class="border">
		<thead>
			<tr>
				<th>Name</th>
				<th>Price</th>
			</tr>
		</thead>
		<tbody>
			{#each data.items as item}
				<tr>
					<td>{item.name}</td>
					<td>
						{#each item.prices as price}
							<span>{price.rarity} - {price.price}</span>
						{/each}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</section>

<section class="mt-4">
	<h3 class="text-center text-5xl font-bold">Screen Shots</h3>
</section>

<style>
	.niceBg {
		background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
		background-color: rgba(0, 0, 0, 0.46);
		background-size: 400% 400%;
		animation: gradient 15s ease infinite;
		background-blend-mode: color;
	}
</style>
