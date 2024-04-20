import { env } from '$env/dynamic/private'
import { enchantments, items, manualFixes, questItems, rarities, treasures } from '$lib/server/constants'
import { error, json } from '@sveltejs/kit'

export async function POST({ locals, request }) {
	const key = request.headers.get('x-api-key')
	if (key !== env.API_KEY) error(401, 'Unauthorized')
	const { db } = locals
	await db.itemPrice.deleteMany()
	await db.rarity.deleteMany()
	await db.item.deleteMany()
	await db.fix.deleteMany()

	const existingItems = await db.item.findMany()
	for (const item of items) {
		if (existingItems.find((i) => i.name === item)) continue
		const createdItem = await db.item.create({
			data: {
				name: item,
			},
		})
		existingItems.push(createdItem)
	}
	const existingRarities = await db.rarity.findMany()
	for (const rarity of rarities) {
		if (existingRarities.find((r) => r.name === rarity)) continue
		const createdRarity = await db.rarity.create({
			data: {
				name: rarity,
			},
		})
		existingRarities.push(createdRarity)
	}
	const existingPrices = await db.itemPrice.findMany()
	for (const treasure of treasures) {
		const existingItem = existingItems.find((i) => i.name === treasure.name)
		if (!existingItem) throw new Error(`Item ${treasure.name} not found`)
		for (let i = 0; i < treasure.values.length; i++) {
			const existingRarity = existingRarities[i]
			const existingPrice = existingPrices.find((p) => p.itemId === existingItem.id && p.rarityId === existingRarity.id)
			if (existingPrice) continue
			const createdPrice = await db.itemPrice.create({
				data: {
					itemId: existingItem.id,
					rarityId: existingRarity.id,
					price: treasure.values[i],
				},
			})
			existingPrices.push(createdPrice)
		}
	}

	for (const questItem of questItems) {
		const existingItem = existingItems.find((i) => i.name === questItem.name)
		const existingRarity = existingRarities.find((r) => r.name === questItem.rarity)
		if (!existingItem) throw new Error(`Item ${questItem.name} not found`)
		if (!existingRarity) throw new Error(`Rarity ${questItem.rarity} not found`)
		const existingPrice = existingPrices.find((p) => p.itemId === existingItem.id && p.rarityId === existingRarity.id)
		if (existingPrice) continue
		const createdPrice = await db.itemPrice.create({
			data: {
				itemId: existingItem.id,
				rarityId: existingRarity.id,
				price: questItem.price,
			},
		})
		existingPrices.push(createdPrice)
	}

	const existingFixes = await db.fix.findMany()
	for (const fix of manualFixes) {
		const existingFix = existingFixes.find((f) => f.from === fix.bad)
		if (existingFix) continue
		const createdFix = await db.fix.create({
			data: {
				from: fix.bad,
				to: fix.good,
			},
		})
	}
	const existingEnchantments = await db.enchantment.findMany()
	for (const enchantment of enchantments) {
		if (existingEnchantments.find((e) => e.name === enchantment)) continue
		const createdEnchantment = await db.enchantment.create({
			data: {
				name: enchantment,
			},
		})
		existingEnchantments.push(createdEnchantment)
	}

	console.log('Imported items, rarities, and treasure prices.')
	return json({ success: true })
}
