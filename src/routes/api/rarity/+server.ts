import { json } from '@sveltejs/kit'

export async function GET({ locals }) {
	const { db } = locals
	const rarities = await db.rarity.findMany()
	return json(rarities)
}
