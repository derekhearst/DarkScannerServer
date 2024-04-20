import { enchantments, items } from '$lib/server/constants'
import type { Item, Rarity, Enchantment } from '@prisma/client'
import { error, json } from '@sveltejs/kit'

export async function GET({ params, locals, url, request }) {
	const itemId = parseInt(params.id)
	if (isNaN(itemId)) error(400, 'Invalid item ID')
	const enchantmentParam = url.searchParams.get('enchantments')
	const rarityParam = url.searchParams.get('rarity')
	if (!rarityParam) error(400, 'Rarity is required')
	const enchantmentIds = enchantmentParam ? enchantmentParam.split(',').map((id) => parseInt(id)) : []
	const rarityId = parseInt(rarityParam)
	if (isNaN(rarityId)) error(400, 'Invalid rarity')
	const { db } = locals
	let prices = await db.itemPrice.findMany({
		where: {
			itemId: itemId,
			rarityId: rarityId,
			enchantments: {
				some: { id: { in: enchantmentIds } },
			},
		},
		include: { enchantments: true },
		orderBy: { createdAt: 'desc' },
	})
	if (prices.length === 0) {
		prices = await db.itemPrice.findMany({
			where: {
				itemId: itemId,
				rarityId: rarityId,
			},
			include: { enchantments: true },
			orderBy: { createdAt: 'desc' },
		})
	}
	if (items.length === 0) {
		return json({
			error: 'No prices found for this item.',
		})
	}

	const sortedPrices = prices.map((price) => price.price).sort((a, b) => a - b)
	const length = sortedPrices.length
	const median =
		length % 2 === 0
			? (sortedPrices[length / 2 - 1] + sortedPrices[length / 2]) / 2
			: sortedPrices[Math.floor(length / 2)]
	const unmatchedEnchantmentsCount = enchantmentIds.filter(
		(enchantmentId) =>
			!prices.some((price) => price.enchantments.some((enchantment) => enchantment.id === enchantmentId)),
	).length

	return json({
		price: median,
		seen: prices.length,
		missingEnchantments: unmatchedEnchantmentsCount,
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
