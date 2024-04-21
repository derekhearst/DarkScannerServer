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
