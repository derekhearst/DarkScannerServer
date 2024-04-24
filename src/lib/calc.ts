import type { ItemPrice } from '@prisma/client'

export function calculateMedian(prices: number[]) {
	const sortedPrices = prices.sort((a, b) => a - b)
	const mid = Math.floor(sortedPrices.length / 2)
	const median = sortedPrices.length % 2 !== 0 ? sortedPrices[mid] : (sortedPrices[mid - 1] + sortedPrices[mid]) / 2
	return median
}

export function calculateAverage(prices: number[]) {
	const total = prices.reduce((acc, price) => acc + price, 0)
	return total / prices.length
}
