import { env } from '$env/dynamic/private'
import { error, json } from '@sveltejs/kit'

export async function GET({ locals, request }) {
	const { db } = locals
	const items = await db.item.findMany()
	return json(items)
}

export async function POST({ locals, request }) {
	const key = request.headers.get('x-api-key')
	if (key !== env.API_KEY) error(401, 'Unauthorized')
	const { db } = locals
	const data = await request.json()

	const item = await db.item.create({
		data,
	})
	return json(item)
}
