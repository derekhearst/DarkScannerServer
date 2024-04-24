import { calculateAverage, calculateMedian } from '$lib/calc'
import { enchantments, items } from '$lib/server/constants'
import type { Item, Rarity, Enchantment, ItemPrice } from '@prisma/client'
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

	type returnType = {
		id: number
		itemId: number
		rarityId: number
		price: number
		createdAt: string
		enchantmentIds: string
	}
	const records: returnType[] = await db.$queryRaw`
		SELECT "ItemPrice".*, GROUP_CONCAT("_EnchantmentToItemPrice"."A") AS "enchantmentIds"
		FROM "ItemPrice"
		LEFT JOIN "_EnchantmentToItemPrice" ON "_EnchantmentToItemPrice"."B" = "ItemPrice"."id"
		WHERE "itemId" = ${itemId} AND "rarityId" = ${rarityId}
		GROUP BY "ItemPrice"."id"`

	const data = records.map((record) => {
		return {
			id: record.id,
			itemId: record.itemId,
			rarityId: record.rarityId,
			price: record.price,
			createdAt: record.createdAt,
			enchantmentIds: record.enchantmentIds.split(',').map((id) => parseInt(id)),
		}
	})

	const exactMatches = data.filter((record) => record.enchantmentIds.every((id) => enchantmentIds.includes(id)))
	const exactPrices = exactMatches.map((record) => record.price)
	const exactAverage = calculateAverage(exactPrices)
	const exactMedian = calculateMedian(exactPrices)
	const randomExactPrices = exactPrices.sort(() => Math.random() - 0.5)
	const exactMax = Math.max(...exactPrices)
	const exactMin = Math.min(...exactPrices)

	const partialMatches = data
	const partialPrices = partialMatches.map((record) => record.price)
	const partialAverage = calculateAverage(partialPrices)
	const partialMedian = calculateMedian(partialPrices)
	const randomPartialPrices = partialPrices.sort(() => Math.random() - 0.5)

	return json({
		exact: {
			median: exactMedian,
			average: exactAverage,
			count: exactPrices.length,
			prices: randomExactPrices.toSpliced(0, Math.min(10, exactPrices.length)),
			max: exactMax,
			min: exactMin,
		},
		partial: {
			median: partialMedian,
			average: partialAverage,
			count: partialPrices.length,
			prices: randomPartialPrices.toSpliced(0, Math.min(10, randomPartialPrices.length)),
		},
	})
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
