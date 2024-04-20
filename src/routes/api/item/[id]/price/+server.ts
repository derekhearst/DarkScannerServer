import type { Item, Rarity, Enchantment } from '@prisma/client'
import { json } from '@sveltejs/kit'

export async function GET({ params, locals, url }) {
	const enchantmentParam = url.searchParams.get('enchantments')
	const enchantmentIds = enchantmentParam ? enchantmentParam.split(',').map((id) => parseInt(id)) : []
	const { db } = locals
	const itemId = parseInt(params.id)
	const prices = await db.itemPrice.findMany({
		where: {
			itemId: itemId,
			enchantments: {
				some: { id: { in: enchantmentIds } },
			},
		},
		orderBy: { createdAt: 'desc' },
	})
	const sum = prices.reduce((acc, price) => acc + price.price, 0)
	const avg = sum / prices.length
	const uncertainty = Math.sqrt(prices.reduce((acc, price) => acc + Math.pow(price.price - avg, 2), 0) / prices.length)

	return json({
		price: avg,
		count: prices.length,
		uncertainty,
	})
}

export async function POST({ locals, request }) {
	const { db } = locals
	type data = {
		item: Item
		rarity: Rarity
		price: number
		enchantments: { enchantment: Enchantment; value: number }[]
	}
	const data = (await request.json()) as data

	const price = await db.itemPrice.create({
		data: {
			itemId: data.item.id,
			rarityId: data.rarity.id,
			price: data.price,
			enchantments: {
				connect: data.enchantments.map((enchantment) => ({
					id: enchantment.enchantment.id,
				})),
			},
		},
	})
	return json(price)
}
