import { calculateAverage, calculateMedian } from '$lib/calc'
import { enchantments, items } from '$lib/server/constants'
import type { Item, Rarity, Enchantment } from '@prisma/client'
import { error, json } from '@sveltejs/kit'

export async function GET({ params, locals, url, request }) {
	const itemId = parseInt(params.id)
	const rarityParam = url.searchParams.get('rarity')
	const enchantmentParam = url.searchParams.get('enchantments')

	if (isNaN(itemId)) error(400, 'Invalid item ID')
	const enchantmentIds = enchantmentParam ? enchantmentParam.split(',').map((id) => parseInt(id)) : []
	if (!enchantmentIds.every((id) => !isNaN(id))) error(400, 'Invalid enchantment IDs')
	const rarityId = parseInt(rarityParam!)
	if (isNaN(rarityId)) error(400, 'Invalid rarity')
	const { db } = locals

	// #region Check for exact match
	const exactMatchPrices = await db.itemPrice.findMany({
		where: {
			itemId: itemId,
			rarityId: rarityId,
			enchantments: {
				every: { id: { in: enchantmentIds } },
			},
		},
		orderBy: { createdAt: 'desc' },
	})
	if (exactMatchPrices.length) {
		const median = calculateMedian(exactMatchPrices)
		const average = calculateAverage(exactMatchPrices)
		return json({
			median: median,
			average: average,
			prices: exactMatchPrices.map((price) => price.price),
			exact: true,
		})
	}
	// #endregion
	// #region Check for partial match
	const partialMatchPrices = await db.itemPrice.findMany({
		where: {
			itemId: itemId,
			rarityId: rarityId,
			enchantments: {
				some: { id: { in: enchantmentIds } },
			},
		},
		include: { enchantments: true },
	})
	if (partialMatchPrices.length) {
		const mappedWithMatchCount = partialMatchPrices.map((price) => {
			const matchCount = price.enchantments.filter((en) => enchantmentIds.includes(en.id)).length
			return { price, matchCount }
		})
		const sortedByEnchantmentInclude = mappedWithMatchCount.sort((price1, price2) => {
			return price1.matchCount - price2.matchCount
		})
		const bestMatch = sortedByEnchantmentInclude[0]
		const matchesBasedOffBestMatch = sortedByEnchantmentInclude.filter(
			(price) => price.matchCount === bestMatch.matchCount,
		)
		const prices = matchesBasedOffBestMatch.map((price) => price.price)
		const median = calculateMedian(prices)
		const average = calculateAverage(prices)
		return json({
			price: median,
			average: average,
			prices: prices.map((price) => price.price),
			matchCount: bestMatch.matchCount,
		})
	}
	// #endregion
	// #region Just get the median
	const prices = await db.itemPrice.findMany({
		where: {
			itemId: itemId,
			rarityId,
		},
	})
	const median = calculateMedian(prices)
	const average = calculateAverage(prices)
	return json({
		price: median,
		average: average,
		prices: prices.map((price) => price.price),
	})
	// #endregion
}

export async function POST({ locals, request }) {
	const { db } = locals
	type data = {
		item: Item
		rarity: Rarity
		enchantments: Enchantment[]
		price: number
	}
	const data = (await request.json()) as data

	const price = await db.itemPrice.create({
		data: {
			itemId: data.item.id,
			rarityId: data.rarity.id,
			price: data.price,
			enchantments: {
				connect: data.enchantments.map((enchantment) => ({
					id: enchantment.id,
				})),
			},
		},
	})
	return json(price)
}
