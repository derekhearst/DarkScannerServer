export async function load({ locals }) {
	const [allItems, allRarities, allEnchantments, allPrices] = await Promise.all([
		locals.db.item.findMany(),
		locals.db.rarity.findMany(),
		locals.db.enchantment.findMany(),
		locals.db.itemPrice.findMany(),
	])

	const data = allItems.map((item) => {
		const prices = allPrices.filter((price) => price.itemId === item.id)
		const data = {
			...item,
			prices: prices.map((price) => ({
				price: price.price,
				rarity: allRarities.find((rarity) => rarity.id === price.rarityId)?.name,
			})),
		}
		return data
	})
	data.sort((a, b) => a.name.localeCompare(b.name))
	return {
		items: data,
		allEnchantments,
		allRarities,
	}
}

export const actions = {
	async importFromConstants({ locals }) {},
}
