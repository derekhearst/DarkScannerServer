import { error, json } from '@sveltejs/kit'

export async function GET({ locals, params, request }) {
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
	const itemId = parseInt(params.id)
	if (isNaN(itemId)) {
		error(400, 'Invalid item ID')
	}

	const newRequest = await locals.db.request.create({
		data: {
			tokenId: existingToken.id,
			params: 'GET /api/item/' + params.id,
		},
	})

	const { db } = locals
	const item = await db.item.findUniqueOrThrow({ where: { id: itemId } })
	return json(item)
}
