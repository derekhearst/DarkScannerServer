import { env } from '$env/dynamic/private'
import { error, json } from '@sveltejs/kit'

export async function GET({ locals, request }) {
	const { db } = locals
	const enchantments = await db.enchantment.findMany()
	return json(enchantments)
}
