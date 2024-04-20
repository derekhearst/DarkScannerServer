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
			params: 'GET /api/rarity',
		},
	})

	const { db } = locals
	const rarities = await db.rarity.findMany()
	return json(rarities)
}
