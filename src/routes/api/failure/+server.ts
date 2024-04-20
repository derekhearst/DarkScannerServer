import { error } from '@sveltejs/kit'

export async function POST({ locals, request }) {
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

	const text = await request.text()
	await locals.db.failure.create({
		data: {
			tokenId: existingToken.id,
			text,
		},
	})
	return new Response(null)
}
