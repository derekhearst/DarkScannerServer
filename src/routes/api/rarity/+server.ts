import { error, json } from '@sveltejs/kit'

export async function GET({ locals, request }) {
	const { db } = locals
	const rarities = await db.rarity.findMany()
	return json(rarities)
}
