import { env } from '$env/dynamic/private'
import { error, json } from '@sveltejs/kit'

export async function POST({ locals, request, cookies }) {
	const key = cookies.get('api_key')
	if (key !== env.API_KEY) error(401, 'Unauthorized')
	const { db } = locals
	const data = await request.json()
	const item = await db.enchantment.create({
		data,
	})
	return json(item)
}
