<script lang="ts">
	import { calculateAverage, calculateMax, calculateMedian, calculateMin, calculateMode } from '$lib/server/calc'
	import type { ItemPrice } from '@prisma/client'

	export let data

	function calculateStatsForItem(prices: ItemPrice[]) {
		const statsByRarity = new Map<number, ItemPrice[]>()
		for (const price of prices) {
			const rarityId = price.rarityId
			if (!statsByRarity.has(rarityId)) {
				statsByRarity.set(rarityId, [])
			}
			statsByRarity.get(rarityId)?.push(price)
		}

		const data = Array.from(statsByRarity.entries()).map(([rarityId, prices]) => {
			const average = calculateAverage(prices)
			const median = calculateMedian(prices)
			const mode = calculateMode(prices)
			const min = calculateMin(prices)
			const max = calculateMax(prices)
			return { rarityId, average, median, mode, min, max }
		})
		return data
	}
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
				<th>Count</th>
				{#each data.allRarities as rarity}
					<th>{rarity.name}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each data.items as item}
				{@const stats = calculateStatsForItem(item.prices)}
				<tr>
					<td>{item.name}</td>3
					<td>{item.prices.length}</td>
					{#each stats as stat}
						<td>
							<div>
								<div>Average: {stat.average}</div>
								<div>Median: {stat.median}</div>
								<div>Mode: {stat.mode}</div>
								<div>Min: {stat.min}</div>
								<div>Max: {stat.max}</div>
							</div>
						</td>
					{/each}
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
