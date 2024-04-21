import type { ItemPrice } from '@prisma/client'

export function calculateMedian(prices: ItemPrice[]) {
	const sortedPrices = prices.map((price) => price.price).sort((a, b) => a - b)
	const length = sortedPrices.length
	const median =
		length % 2 === 0
			? (sortedPrices[length / 2 - 1] + sortedPrices[length / 2]) / 2
			: sortedPrices[Math.floor(length / 2)]
	return median
}

export function calculateAverage(prices: ItemPrice[]) {
	const total = prices.reduce((acc, price) => acc + price.price, 0)
	return total / prices.length
}

export function calculateMode(prices: ItemPrice[]) {
	const counts = new Map<number, number>()
	for (const price of prices) {
		const count = counts.get(price.price) ?? 0
		counts.set(price.price, count + 1)
	}
	const maxCount = Math.max(...counts.values())
	const modes = [...counts.entries()].filter(([, count]) => count === maxCount).map(([price]) => price)
	return modes
}

export function calculateMin(prices: ItemPrice[]) {
	return Math.min(...prices.map((price) => price.price))
}

export function calculateMax(prices: ItemPrice[]) {
	return Math.max(...prices.map((price) => price.price))
}
