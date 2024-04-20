import { env } from '$env/dynamic/private'
import { error, json } from '@sveltejs/kit'

export async function GET({ locals, request }) {
	const token = request.headers.get('token')
	if (!token) {
		error(401, 'Unauthorized')
	}
	const existingToken = await locals.db.token.findFirst({
		where: { key: token },
	})
	if (!existingToken) {
		error(401, 'Unauthorized')
	}

	const newRequest = await locals.db.request.create({
		data: {
			tokenId: existingToken.id,
			params: 'GET /api/item',
		},
	})

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
