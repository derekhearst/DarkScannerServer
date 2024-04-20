export async function load({ locals }) {
	const items = locals.db.item.findMany()

	return {
		items: await items,
	}
}
