export async function load({ locals }) {
	const allItems = await locals.db.item.findMany()
	const allRarities = await locals.db.rarity.findMany()
	const allEnchantments = await locals.db.enchantment.findMany()
	const allPrices = await locals.db.itemPrice.findMany()
	const allFailures = await locals.db.failure.findMany()
	const allTokens = await locals.db.token.findMany()
	const allRequests = await locals.db.request.findMany()

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
		allPrices,
		allRarities,
		allFailures,
		allTokens,
		allRequests,
	}
}

export const actions = {
	async importFromConstants({ locals }) {},
}
